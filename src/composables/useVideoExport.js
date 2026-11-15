import { computed, onBeforeUnmount, ref } from 'vue'
import { Muxer, ArrayBufferTarget } from 'mp4-muxer'
import {
  createRecordingPcmTap,
  getRecordingAudioStream,
  isFile,
  onTrackEnded,
  pausePlayback,
  restartSelectedTrack
} from './useAudioReactive'

/**
 * Export the animated hero canvas plus the selected music track as an MP4.
 *
 * Preferred path: WebCodecs (H.264 + AAC/Opus) muxed with mp4-muxer. Canvas
 * pixels are copied each frame onto an opaque canvas filled with the page
 * background, so the recording contains only the scene (never the page DOM)
 * and has no alpha compositing. Audio is tapped after the band-pass filter
 * (pre-monitor) by an AudioWorklet, with a MediaStreamTrackProcessor on the
 * recording MediaStream as a fallback. Canvas frames are sRGB: Chrome's H.264
 * encoder reports BT.709 primaries/matrix (full range) in its decoder config,
 * and mp4-muxer writes that as an nclx `colr` box. The result is tagged
 * BT.709 rather than the BT.601 default that made earlier exports look wrong.
 *
 * If WebCodecs or the muxer cannot be used, the old MediaRecorder path is
 * kept as a WebM-only fallback. We never mislabel a WebM/VP9 recording as MP4.
 */

const CANVAS_SELECTOR = 'canvas.hero-canvas'
const PAGE_BACKGROUND = '#05070d'
const CAPTURE_FPS = 60
const FRAME_DURATION_US = Math.round(1_000_000 / CAPTURE_FPS)
const FRAME_INTERVAL_MS = 1000 / CAPTURE_FPS
const VIDEO_BITS_PER_SECOND = 12_000_000
const AUDIO_BITS_PER_SECOND = 192_000
const AUDIO_SAMPLE_RATE = 48_000
const AUDIO_CHANNELS = 2
const KEYFRAME_INTERVAL = CAPTURE_FPS * 2
const MAX_ENCODE_QUEUE = 8
const CHUNK_MS = 1000
const TAIL_MS = 250
const CLOCK_INTERVAL_MS = 250
const DOWNLOAD_URL_LIFETIME_MS = 60_000

// Most specific first. Chrome's software H.264 encoder normally accepts High
// profile (avc1.640028); the others are there for other builds/platforms.
const H264_CODECS = ['avc1.640028', 'avc1.4D401F', 'avc1.42001E']
const AUDIO_CODECS = [
  { codec: 'mp4a.40.2', muxerCodec: 'aac', label: 'AAC' },
  { codec: 'opus', muxerCodec: 'opus', label: 'Opus' }
]

// MediaRecorder is only a fallback and is deliberately WebM-only: producing an
// MP4 container from a recorder that actually wrote VP9/Opus (or tagged the
// colour space as BT.601) is exactly the bug this exporter avoids.
const WEBM_MIME_CANDIDATES = [
  'video/webm;codecs="vp9,opus"',
  'video/webm;codecs="vp8,opus"',
  'video/webm'
]

function isWebCodecsAvailable() {
  return (
    typeof VideoEncoder === 'function' &&
    typeof VideoFrame === 'function' &&
    typeof AudioEncoder === 'function' &&
    typeof AudioData === 'function' &&
    (typeof MediaStreamTrackProcessor === 'function' ||
      typeof AudioWorkletNode === 'function') &&
    typeof VideoEncoder.isConfigSupported === 'function' &&
    typeof AudioEncoder.isConfigSupported === 'function'
  )
}

function supportsMime(mime) {
  return (
    typeof MediaRecorder !== 'undefined' &&
    typeof MediaRecorder.isTypeSupported === 'function' &&
    MediaRecorder.isTypeSupported(mime)
  )
}

function containerFor(mime) {
  const normalized = (mime || '').toLowerCase()
  if (normalized.includes('mp4')) return 'mp4'
  if (normalized.includes('webm')) return 'webm'
  if (normalized.includes('matroska')) return 'mkv'
  return ''
}

function formatDuration(seconds) {
  const total = Math.max(0, Math.floor(seconds))
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const secs = total % 60
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }
  return `${minutes}:${String(secs).padStart(2, '0')}`
}

function timestampName(date = new Date()) {
  const pad = (value) => String(value).padStart(2, '0')
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate())
  ].join('-') + `_${pad(date.getHours())}-${pad(date.getMinutes())}-${pad(date.getSeconds())}`
}

function videoBitrateFor(canvas) {
  const pixelsPerSecond = Math.max(1, canvas.width * canvas.height) * CAPTURE_FPS
  // ~0.06 bits/pixel/second is a typical high-quality 60 fps screen recording.
  return Math.min(16_000_000, Math.max(4_000_000, Math.round(pixelsPerSecond * 0.06)))
}

function evenSize(value) {
  // H.264 encoders require even dimensions. The scene canvas is usually even,
  // but a devicePixelRatio-driven bitmap can be odd by one pixel.
  return Math.max(2, value - (value % 2))
}

async function probeWebCodecs(width, height) {
  if (!isWebCodecsAvailable()) return null

  let videoConfig = null
  for (const codec of H264_CODECS) {
    const config = {
      codec,
      width,
      height,
      bitrate: VIDEO_BITS_PER_SECOND,
      framerate: CAPTURE_FPS,
      avc: { format: 'avc' }
    }
    try {
      const support = await VideoEncoder.isConfigSupported(config)
      if (support?.supported) {
        videoConfig = { ...config, ...(support.config || {}) }
        break
      }
    } catch {
      /* this profile is not usable here; try the next one */
    }
  }
  if (!videoConfig) return null

  let audioConfig = null
  let audioMuxerCodec = ''
  let audioLabel = ''
  for (const candidate of AUDIO_CODECS) {
    const config = {
      codec: candidate.codec,
      sampleRate: AUDIO_SAMPLE_RATE,
      numberOfChannels: AUDIO_CHANNELS,
      bitrate: AUDIO_BITS_PER_SECOND
    }
    try {
      const support = await AudioEncoder.isConfigSupported(config)
      if (support?.supported) {
        audioConfig = { ...config, ...(support.config || {}) }
        audioMuxerCodec = candidate.muxerCodec
        audioLabel = candidate.label
        break
      }
    } catch {
      /* AAC is often unavailable; Opus is the usual fallback */
    }
  }
  if (!audioConfig) return null

  return { videoConfig, audioConfig, audioMuxerCodec, audioLabel }
}

function readAudioPlanes(data) {
  const frameCount = data.numberOfFrames
  const channelCount = data.numberOfChannels
  if (!frameCount || !channelCount) return []

  const format = String(data.format || '')
  if (format === 'f32-planar') {
    const planes = []
    for (let channel = 0; channel < channelCount; channel += 1) {
      const plane = new Float32Array(frameCount)
      data.copyTo(plane, { planeIndex: channel, format: 'f32-planar' })
      planes.push(plane)
    }
    return planes
  }

  if (format === 'f32') {
    const interleaved = new Float32Array(frameCount * channelCount)
    data.copyTo(interleaved, { planeIndex: 0, format: 'f32' })
    const planes = Array.from({ length: channelCount }, () => new Float32Array(frameCount))
    for (let frame = 0; frame < frameCount; frame += 1) {
      for (let channel = 0; channel < channelCount; channel += 1) {
        planes[channel][frame] = interleaved[frame * channelCount + channel]
      }
    }
    return planes
  }

  // Other sample formats: ask Chrome to convert each plane to float.
  const planes = []
  for (let channel = 0; channel < channelCount; channel += 1) {
    const plane = new Float32Array(frameCount)
    data.copyTo(plane, { planeIndex: channel, format: 'f32-planar' })
    planes.push(plane)
  }
  return planes
}

function resampleChannel(input, fromRate, toRate) {
  if (fromRate === toRate || input.length === 0) return input
  const outputLength = Math.max(1, Math.round((input.length * toRate) / fromRate))
  const output = new Float32Array(outputLength)
  const ratio = fromRate / toRate
  const last = input.length - 1
  for (let i = 0; i < outputLength; i += 1) {
    const position = i * ratio
    const index = Math.min(last, Math.floor(position))
    const next = Math.min(last, index + 1)
    const frac = position - index
    output[i] = input[index] * (1 - frac) + input[next] * frac
  }
  return output
}

/**
 * AudioEncoder wants 48 kHz stereo. MediaStreamTrackProcessor usually delivers
 * exactly that; this adapts mono/44.1 kHz sources as well.
 */
function encoderAudioData(data) {
  if (data.sampleRate === AUDIO_SAMPLE_RATE && data.numberOfChannels === AUDIO_CHANNELS) {
    return data
  }

  const planes = readAudioPlanes(data)
  if (planes.length === 0) return null
  const leftSource = planes[0]
  const rightSource = planes[1] || planes[0]
  const left = resampleChannel(leftSource, data.sampleRate, AUDIO_SAMPLE_RATE)
  const right = resampleChannel(rightSource, data.sampleRate, AUDIO_SAMPLE_RATE)
  const frames = Math.min(left.length, right.length)
  if (frames === 0) return null

  const planar = new Float32Array(frames * AUDIO_CHANNELS)
  planar.set(left.subarray(0, frames), 0)
  planar.set(right.subarray(0, frames), frames)

  return new AudioData({
    format: 'f32-planar',
    sampleRate: AUDIO_SAMPLE_RATE,
    numberOfFrames: frames,
    numberOfChannels: AUDIO_CHANNELS,
    timestamp: data.timestamp,
    data: planar
  })
}

function createExportFrame(canvas, timestamp) {
  const base = { timestamp, duration: FRAME_DURATION_US }
  try {
    // Chrome ignores this hint for canvas-backed frames, but it documents the
    // intended transfer and older/future implementations may honour it. The
    // encoder's decoderConfig is what mp4-muxer actually writes to `colr`.
    return new VideoFrame(canvas, {
      ...base,
      colorSpace: {
        primaries: 'bt709',
        transfer: 'iec61966-2-1',
        matrix: 'rgb',
        fullRange: true
      }
    })
  } catch {
    return new VideoFrame(canvas, base)
  }
}

export function useVideoExport() {
  const exporting = ref(false)
  const elapsed = ref(0)
  const notice = ref('')
  const error = ref('')

  let mode = null // 'webcodecs' | 'webm'
  let starting = false
  let ending = false
  let finalized = false
  let aborted = false
  let startedAt = 0
  let clockTimer = 0
  let stopTimer = 0
  let unsubscribeEnded = null
  let wc = null
  let fallback = null
  const pendingUrls = new Set()

  const elapsedLabel = computed(() => formatDuration(elapsed.value))
  const exportLabel = computed(() => {
    if (exporting.value) return 'Stop export and save video'
    if (!isFile.value) return 'Export video (load a music file first)'
    return 'Export animated background with music'
  })

  function clearClock() {
    if (clockTimer) {
      window.clearInterval(clockTimer)
      clockTimer = 0
    }
  }

  function stopClockAndFreeze() {
    if (startedAt) {
      elapsed.value = Math.max(elapsed.value, (performance.now() - startedAt) / 1000)
      startedAt = 0
    }
    clearClock()
  }

  function startClock() {
    clearClock()
    elapsed.value = 0
    startedAt = performance.now()
    clockTimer = window.setInterval(() => {
      elapsed.value = (performance.now() - startedAt) / 1000
    }, CLOCK_INTERVAL_MS)
  }

  function clearTimers() {
    clearClock()
    if (stopTimer) {
      window.clearTimeout(stopTimer)
      stopTimer = 0
    }
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob)
    pendingUrls.add(url)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.rel = 'noopener'
    document.body.appendChild(link)
    try {
      link.click()
    } finally {
      link.remove()
    }
    // Give the browser time to start the download before releasing the URL.
    window.setTimeout(() => {
      URL.revokeObjectURL(url)
      pendingUrls.delete(url)
    }, DOWNLOAD_URL_LIFETIME_MS)
  }

  function releasePendingUrls() {
    for (const url of pendingUrls) URL.revokeObjectURL(url)
    pendingUrls.clear()
  }

  function closeVideoEncoder(session) {
    if (!session?.videoEncoder) return
    try {
      session.videoEncoder.close()
    } catch {
      /* already closed */
    }
    session.videoEncoder = null
  }

  function closeAudioEncoder(session) {
    if (!session?.audioEncoder) return
    try {
      session.audioEncoder.close()
    } catch {
      /* already closed */
    }
    session.audioEncoder = null
  }

  function stopWebCodecsCapture(session) {
    if (!session) return
    session.stopping = true
    if (session.videoRaf) {
      cancelAnimationFrame(session.videoRaf)
      session.videoRaf = 0
    }
  }

  async function stopWebCodecsAudio(session) {
    if (!session) return
    session.stopping = true
    const tap = session.audioTap
    session.audioTap = null
    const reader = session.audioReader
    session.audioReader = null

    if (tap) {
      // Flush and close the worklet first so queued PCM can still be encoded.
      try {
        await tap.stop()
      } catch {
        /* already stopped */
      }
    } else if (reader) {
      try {
        await reader.cancel()
      } catch {
        /* the stream may already have ended */
      }
    }

    if (session.audioPumpPromise) {
      try {
        await session.audioPumpPromise
      } catch {
        /* errors are surfaced by the pump itself */
      }
    }

    if (reader) {
      try {
        reader.releaseLock()
      } catch {
        /* a pending read can keep the lock; cancellation releases it */
      }
    }
  }

  function discardWebCodecs(session) {
    if (!session) return
    session.aborted = true
    session.finalizing = true
    session.finalized = true
    stopWebCodecsCapture(session)
    if (session.audioTap) {
      try {
        void session.audioTap.stop()
      } catch {
        /* already stopped */
      }
      session.audioTap = null
    }
    if (session.audioReader) {
      try {
        session.audioReader.cancel()
      } catch {
        /* already gone */
      }
      session.audioReader = null
    }
    closeVideoEncoder(session)
    closeAudioEncoder(session)
    if (session.exportCanvas) {
      session.exportCanvas.width = 0
      session.exportCanvas.height = 0
    }
    session.exportCanvas = null
    session.exportCtx = null
  }

  function releaseFallback() {
    if (!fallback) return
    if (fallback.recorder) {
      fallback.recorder.ondataavailable = null
      fallback.recorder.onstop = null
      fallback.recorder.onerror = null
    }
    if (fallback.canvasStream) {
      fallback.canvasStream.getTracks().forEach((track) => track.stop())
    }
    fallback.canvasStream = null
    fallback.recorder = null
    fallback.chunks = []
    fallback = null
  }

  function detachEndedListener() {
    if (unsubscribeEnded) {
      unsubscribeEnded()
      unsubscribeEnded = null
    }
  }

  function resetExportState() {
    ending = false
    finalized = false
    aborted = false
  }

  function finishExportState() {
    clearTimers()
    detachEndedListener()
    ending = false
    exporting.value = false
    mode = null
  }

  async function finalizeWebCodecs(session, wasAborted) {
    if (!session || session.finalizing) return
    session.finalizing = true
    stopClockAndFreeze()
    pausePlayback()
    stopWebCodecsCapture(session)
    await stopWebCodecsAudio(session)

    let failed = wasAborted
    if (!failed) {
      // Ensure the video timeline reaches the stop point even if the last rAF
      // frame was skipped under encoder backpressure.
      try {
        if (session.videoFrames > 0 && drawExportFrame(session)) {
          const finalTimestamp = Math.max(
            session.lastVideoTimestamp + 1,
            Math.round(performance.now() * 1000)
          )
          const finalFrame = createExportFrame(session.exportCanvas, finalTimestamp)
          session.videoEncoder.encode(finalFrame, { keyFrame: false })
          finalFrame.close()
          session.videoFrames += 1
          session.lastVideoTimestamp = finalTimestamp
        }
      } catch {
        // The final frame is best-effort; the existing export is still valid.
      }

      const results = await Promise.allSettled([
        session.videoEncoder.flush(),
        session.audioEncoder.flush()
      ])
      const rejected = results.find((result) => result.status === 'rejected')
      if (rejected) {
        failed = true
        if (!error.value) {
          error.value = `The encoder could not finish the video${rejected.reason?.message ? `: ${rejected.reason.message}` : '.'}`
        }
      }
      // An output callback may have seen a muxing/encoding error while the
      // flush was in progress; never finalize a half-written MP4.
      if (session.aborted || session.failure) failed = true
    }

    closeVideoEncoder(session)
    closeAudioEncoder(session)
    session.muxerClosed = true

    let buffer = null
    if (!failed) {
      try {
        session.muxer.finalize()
        buffer = session.muxer.target.buffer
        if (!buffer || buffer.byteLength === 0) {
          throw new Error('the muxer produced an empty file')
        }
      } catch (caught) {
        failed = true
        if (!error.value) {
          error.value = `The MP4 could not be finalized${caught?.message ? `: ${caught.message}` : '.'}`
        }
      }
    }

    const width = session.width
    const height = session.height
    const audioLabel = session.audioLabel
    if (session.exportCanvas) {
      session.exportCanvas.width = 0
      session.exportCanvas.height = 0
    }
    if (wc === session) wc = null
    session.finalized = true

    if (!failed && buffer) {
      try {
        const filename = `hero-background-${timestampName()}.mp4`
        const blob = new Blob([buffer], { type: 'video/mp4' })
        downloadBlob(blob, filename)
        const color = session.videoColorSpace
        const colorLabel = color?.matrix === 'bt709' && color?.primaries === 'bt709'
          ? ', BT.709'
          : ''
        notice.value = `Saved ${filename} (${formatDuration(elapsed.value)}) — H.264 ${width}×${height} + ${audioLabel} 48 kHz${colorLabel}.`
      } catch (caught) {
        error.value = `The video was encoded but could not be saved${caught?.message ? `: ${caught.message}` : '.'}`
      }
    }

    finishExportState()
    finalized = true
  }

  async function failWebCodecs(session, message) {
    if (!session) return
    if (message) {
      session.failure = session.failure || message
      if (!error.value) error.value = session.failure
    }
    aborted = true
    session.aborted = true
    if (session.finalizing || session.finalized) return
    await finalizeWebCodecs(session, true)
  }

  async function pumpAudio(session) {
    const reader = session.audioReader
    try {
      while (!session.aborted && !session.finalized) {
        const { value: data, done } = await reader.read()
        if (done) break
        if (!data) continue
        if (session.aborted || session.finalized) {
          try {
            data.close()
          } catch {
            /* already closed */
          }
          break
        }

        let input = null
        try {
          input = encoderAudioData(data)
          if (input) session.audioEncoder.encode(input)
        } catch (caught) {
          // Do not await the finalizer here: it waits for this pump to finish.
          void failWebCodecs(
            session,
            `The audio track could not be encoded${caught?.message ? `: ${caught.message}` : '.'}`
          )
          break
        } finally {
          if (input && input !== data) {
            try {
              input.close()
            } catch {
              /* already closed */
            }
          }
          try {
            data.close()
          } catch {
            /* already closed */
          }
        }
      }
    } catch (caught) {
      if (!session.stopping && !session.finalized) {
        // See above: finalization awaits this promise, so fire and forget.
        void failWebCodecs(
          session,
          `Audio capture failed${caught?.message ? `: ${caught.message}` : '.'}`
        )
      }
    } finally {
      session.audioPumpDone = true
    }
  }

  async function pumpTapAudio(session) {
    const tap = session.audioTap
    try {
      while (!session.aborted && !session.finalized) {
        const chunk = await tap.read()
        if (!chunk) break
        if (session.aborted || session.finalized) break

        const data = new AudioData({
          format: 'f32-planar',
          sampleRate: chunk.sampleRate,
          numberOfFrames: chunk.frames,
          numberOfChannels: AUDIO_CHANNELS,
          timestamp: chunk.timestampUs,
          data: chunk.data
        })

        let input = null
        try {
          input = encoderAudioData(data)
          if (input) session.audioEncoder.encode(input)
        } catch (caught) {
          // Do not await the finalizer here: it waits for this pump to finish.
          void failWebCodecs(
            session,
            `The audio track could not be encoded${caught?.message ? `: ${caught.message}` : '.'}`
          )
          break
        } finally {
          if (input && input !== data) {
            try {
              input.close()
            } catch {
              /* already closed */
            }
          }
          try {
            data.close()
          } catch {
            /* already closed */
          }
        }
      }
    } catch (caught) {
      if (!session.aborted && !session.finalized) {
        // See above: finalization awaits this promise, so fire and forget.
        void failWebCodecs(
          session,
          `Audio capture failed${caught?.message ? `: ${caught.message}` : '.'}`
        )
      }
    } finally {
      session.audioPumpDone = true
    }
  }

  function drawExportFrame(session) {
    if (!session?.sourceCanvas || !session.exportCtx) return false
    const source = session.sourceCanvas
    if (!source.width || !source.height) return false
    const ctx = session.exportCtx
    // Opaque page background first: the scene canvas itself is transparent,
    // and an alpha-composited capture would encode incorrectly.
    ctx.fillStyle = PAGE_BACKGROUND
    ctx.fillRect(0, 0, session.width, session.height)
    ctx.drawImage(source, 0, 0, source.width, source.height, 0, 0, session.width, session.height)
    return true
  }

  function captureFrame(session, now) {
    if (!session || session.stopping || session.finalized) return
    session.videoRaf = requestAnimationFrame((time) => captureFrame(session, time))

    if (now < session.nextFrameDue) return
    session.nextFrameDue += FRAME_INTERVAL_MS
    // If encoder backpressure or a long task made us fall behind, do not try
    // to catch up by encoding a burst of frames.
    if (session.nextFrameDue < now) session.nextFrameDue = now + FRAME_INTERVAL_MS

    const source = session.sourceCanvas
    if (!source || !source.width || !source.height) return

    try {
      if (!drawExportFrame(session)) return
    } catch (caught) {
      void failWebCodecs(
        session,
        `The animated background could not be captured${caught?.message ? `: ${caught.message}` : '.'}`
      )
      return
    }

    if (session.videoEncoder.encodeQueueSize > MAX_ENCODE_QUEUE) return

    const timestamp = Math.max(
      session.lastVideoTimestamp + 1,
      Math.round(performance.now() * 1000)
    )
    try {
      const frame = createExportFrame(session.exportCanvas, timestamp)
      session.videoEncoder.encode(frame, {
        keyFrame: session.videoFrames === 0 || session.videoFrames % KEYFRAME_INTERVAL === 0
      })
      frame.close()
      session.videoFrames += 1
      session.lastVideoTimestamp = timestamp
    } catch (caught) {
      void failWebCodecs(
        session,
        `The video frame could not be encoded${caught?.message ? `: ${caught.message}` : '.'}`
      )
    }
  }

  async function createWebCodecsSession(canvas, capability) {
    const width = evenSize(canvas.width)
    const height = evenSize(canvas.height)
    if (width < 2 || height < 2) {
      throw new Error('The animated background canvas has no drawable pixels.')
    }

    const exportCanvas = document.createElement('canvas')
    exportCanvas.width = width
    exportCanvas.height = height
    const exportCtx = exportCanvas.getContext('2d', { alpha: false })
    if (!exportCtx) throw new Error('Could not create the export canvas.')
    exportCtx.fillStyle = PAGE_BACKGROUND
    exportCtx.fillRect(0, 0, width, height)
    exportCtx.imageSmoothingEnabled = true

    const audioStream = await getRecordingAudioStream()
    const audioTrack = audioStream?.getAudioTracks?.()[0]
    if (!audioTrack) {
      throw new Error('Could not capture the selected music track.')
    }

    const muxer = new Muxer({
      target: new ArrayBufferTarget(),
      video: { codec: 'avc', width, height, frameRate: CAPTURE_FPS },
      audio: {
        codec: capability.audioMuxerCodec,
        numberOfChannels: AUDIO_CHANNELS,
        sampleRate: AUDIO_SAMPLE_RATE
      },
      fastStart: 'in-memory',
      // AudioData and VideoFrame timestamps both come from performance.now(),
      // so offsetting both tracks by the earliest first timestamp keeps A/V
      // sync without relying on either track starting at exactly zero.
      firstTimestampBehavior: 'cross-track-offset'
    })

    const session = {
      sourceCanvas: canvas,
      exportCanvas,
      exportCtx,
      width,
      height,
      audioTrack,
      muxer,
      muxerClosed: false,
      videoEncoder: null,
      audioEncoder: null,
      audioReader: null,
      audioPumpPromise: null,
      audioPumpDone: false,
      videoRaf: 0,
      nextFrameDue: 0,
      lastVideoTimestamp: 0,
      videoFrames: 0,
      videoColorSpace: null,
      stopping: false,
      finalizing: false,
      finalized: false,
      audioLabel: capability.audioLabel
    }

    try {
      session.videoEncoder = new VideoEncoder({
        output(chunk, meta) {
          if (session.aborted || session.muxerClosed) return
          try {
            if (!session.videoColorSpace && meta?.decoderConfig?.colorSpace) {
              session.videoColorSpace = meta.decoderConfig.colorSpace
            }
            session.muxer.addVideoChunk(chunk, meta)
          } catch (caught) {
            void failWebCodecs(
              session,
              `The video could not be muxed${caught?.message ? `: ${caught.message}` : '.'}`
            )
          }
        },
        error(caught) {
          void failWebCodecs(
            session,
            `Video encoding failed${caught?.message ? `: ${caught.message}` : '.'}`
          )
        }
      })
      session.videoEncoder.configure(capability.videoConfig)

      session.audioEncoder = new AudioEncoder({
        output(chunk, meta) {
          if (session.aborted || session.muxerClosed) return
          try {
            session.muxer.addAudioChunk(chunk, meta)
          } catch (caught) {
            void failWebCodecs(
              session,
              `The audio could not be muxed${caught?.message ? `: ${caught.message}` : '.'}`
            )
          }
        },
        error(caught) {
          void failWebCodecs(
            session,
            `Audio encoding failed${caught?.message ? `: ${caught.message}` : '.'}`
          )
        }
      })
      session.audioEncoder.configure(capability.audioConfig)
    } catch (caught) {
      closeVideoEncoder(session)
      closeAudioEncoder(session)
      throw caught
    }

    return session
  }

  async function beginWebCodecs(session) {
    // Start from a quiet graph: the tap must not include a few milliseconds of
    // the track's previous playback position before restartSelectedTrack().
    pausePlayback()

    // Prefer the AudioWorklet tap: it runs on the audio thread and never
    // starves when the main thread is busy drawing/encoding. Fall back to the
    // recording MediaStream track via MediaStreamTrackProcessor.
    let tap = null
    try {
      tap = await createRecordingPcmTap({ chunkFrames: 960 })
    } catch {
      tap = null
    }

    if (tap) {
      session.audioTap = tap
      session.audioPumpPromise = pumpTapAudio(session)
    } else {
      let processor = null
      try {
        processor = new MediaStreamTrackProcessor({ track: session.audioTrack })
      } catch (caught) {
        throw new Error(`The audio track could not be processed${caught?.message ? `: ${caught.message}` : '.'}`)
      }

      session.audioReader = processor.readable.getReader()
      session.audioPumpPromise = pumpAudio(session)
    }

    session.nextFrameDue = performance.now()
    session.videoRaf = requestAnimationFrame((time) => captureFrame(session, time))

    startClock()
    unsubscribeEnded = onTrackEnded(requestStop)

    const started = await restartSelectedTrack()
    if (!started) {
      throw new Error('The selected track could not start from the beginning.')
    }
    if (ending) pausePlayback()
  }

  function createWebmRecorder(stream, canvas) {
    const options = {
      videoBitsPerSecond: videoBitrateFor(canvas),
      audioBitsPerSecond: AUDIO_BITS_PER_SECOND
    }

    const candidates = WEBM_MIME_CANDIDATES.filter(supportsMime)
    if (candidates.length === 0) {
      throw new Error(
        'This browser supports neither WebCodecs MP4 export nor WebM recording, so video export is unavailable.'
      )
    }

    let lastError = null
    for (const mimeType of candidates) {
      try {
        const recorder = new MediaRecorder(stream, { ...options, mimeType })
        const container = containerFor(recorder.mimeType)
        if (container !== 'webm') {
          throw new Error(`the browser chose ${recorder.mimeType || 'an unknown container'}`)
        }
        return recorder
      } catch (caught) {
        lastError = caught
      }
    }

    throw lastError || new Error('The browser could not create a WebM recorder.')
  }

  function finalizeFallback() {
    if (finalized) return
    finalized = true
    stopClockAndFreeze()
    pausePlayback()

    const savedChunks = fallback?.chunks ? fallback.chunks.slice() : []
    const mime = fallback?.recorder?.mimeType || fallback?.mime || ''
    const wasAborted = aborted

    releaseFallback()
    finishExportState()

    if (wasAborted) return
    if (savedChunks.length === 0) {
      error.value = 'The recorder produced no video data. Try exporting again.'
      return
    }

    const container = containerFor(mime)
    if (container !== 'webm') {
      error.value = `The browser produced ${container || 'an unrecognised format'} instead of WebM, so nothing was saved.`
      return
    }

    try {
      const blob = new Blob(savedChunks, { type: mime || 'video/webm' })
      const filename = `hero-background-${timestampName()}.webm`
      downloadBlob(blob, filename)
      notice.value = `Saved ${filename} (${formatDuration(elapsed.value)}) — MP4 export was unavailable, so this is a WebM fallback.`
    } catch (caught) {
      error.value = `The video was recorded but could not be saved${caught?.message ? `: ${caught.message}` : '.'}`
    }
  }

  function abortFallback(message) {
    if (message && !error.value) error.value = message
    aborted = true
    ending = true
    clearClock()
    detachEndedListener()

    const recorder = fallback?.recorder
    if (recorder && recorder.state !== 'inactive') {
      try {
        recorder.stop()
      } catch {
        finalizeFallback()
      }
      return
    }
    if (recorder) {
      finalizeFallback()
    } else {
      releaseFallback()
      finishExportState()
      finalized = true
    }
  }

  async function startWebmFallback(canvas) {
    let localCanvasStream = null
    try {
      pausePlayback()
      const audioStream = await getRecordingAudioStream()
      const audioTrack = audioStream?.getAudioTracks?.()[0]
      if (!audioTrack) {
        throw new Error('Could not capture the selected music track.')
      }

      localCanvasStream = canvas.captureStream(CAPTURE_FPS)
      const videoTrack = localCanvasStream.getVideoTracks()[0]
      if (!videoTrack) {
        throw new Error('The animated background did not provide a video track.')
      }

      const combinedStream = new MediaStream([videoTrack, audioTrack])
      const recorder = createWebmRecorder(combinedStream, canvas)
      const container = containerFor(recorder.mimeType)

      fallback = {
        recorder,
        canvasStream: localCanvasStream,
        chunks: [],
        mime: recorder.mimeType,
        container
      }
      localCanvasStream = null

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0 && fallback?.recorder === recorder) {
          fallback.chunks.push(event.data)
        }
      }
      recorder.onstop = finalizeFallback
      recorder.onerror = (event) => {
        abortFallback(
          `Video export failed${event?.error?.message ? `: ${event.error.message}` : '.'}`
        )
      }

      notice.value = 'WebCodecs MP4 export is not available in this browser — recording WebM instead.'
      unsubscribeEnded = onTrackEnded(requestStop)
      recorder.start(CHUNK_MS)
      startClock()

      const started = await restartSelectedTrack()
      if (!started) {
        throw new Error('The selected track could not start from the beginning.')
      }
      if (ending) pausePlayback()
    } catch (caught) {
      if (localCanvasStream) {
        localCanvasStream.getTracks().forEach((track) => track.stop())
      }
      throw caught
    }
  }

  function cleanupFailedStart() {
    detachEndedListener()
    clearTimers()
    if (wc) {
      discardWebCodecs(wc)
      wc = null
    }
    if (fallback) {
      if (fallback.recorder && fallback.recorder.state !== 'inactive') {
        try {
          fallback.recorder.stop()
        } catch {
          /* discard below */
        }
      }
      releaseFallback()
    }
    ending = false
    exporting.value = false
    mode = null
    finalized = true
  }

  async function startExport() {
    if (starting || exporting.value) return

    error.value = ''
    notice.value = ''

    if (!isFile.value) {
      error.value = 'Load a music file first — microphone audio is not exported as a track.'
      return
    }

    const canvas = document.querySelector(CANVAS_SELECTOR)
    if (!canvas || !canvas.width || !canvas.height) {
      error.value = 'The animated background canvas is not available to capture.'
      return
    }

    starting = true
    exporting.value = true
    resetExportState()
    elapsed.value = 0

    let usedWebCodecs = false
    try {
      let capability = null
      try {
        capability = await probeWebCodecs(
          evenSize(canvas.width),
          evenSize(canvas.height)
        )
      } catch {
        // A broken WebCodecs implementation should not prevent the WebM
        // fallback from being used.
        capability = null
      }

      if (capability) {
        let session = null
        try {
          session = await createWebCodecsSession(canvas, capability)
        } catch {
          // WebCodecs exists but this configuration could not be created;
          // fall through to the WebM recorder instead of producing bad MP4.
          session = null
        }

        if (session) {
          wc = session
          mode = 'webcodecs'
          usedWebCodecs = true
          try {
            await beginWebCodecs(session)
          } catch (caught) {
            const message = caught?.message || 'The MP4 export could not start.'
            if (!error.value) error.value = message
            await failWebCodecs(session, message)
          }
        }
      }

      if (!usedWebCodecs) {
        mode = 'webm'
        try {
          await startWebmFallback(canvas)
        } catch (caught) {
          const message = caught?.message || 'Video export could not start.'
          const supportHint = isWebCodecsAvailable()
            ? ''
            : ' WebCodecs MP4 export is unavailable in this browser.'
          error.value = /WebCodecs MP4 export/.test(message)
            ? message
            : `${message}${supportHint}`
          cleanupFailedStart()
        }
      }
    } catch (caught) {
      if (exporting.value) {
        error.value = caught?.message || 'Video export could not start.'
        cleanupFailedStart()
      }
    } finally {
      starting = false
    }
  }

  function requestStop() {
    if (!exporting.value || ending) return
    ending = true
    pausePlayback()
    stopClockAndFreeze()

    if (mode === 'webcodecs' && wc) {
      const session = wc
      stopWebCodecsCapture(session)
      void finalizeWebCodecs(session, aborted)
      return
    }

    if (mode === 'webm' && fallback) {
      if (fallback.recorder?.state === 'inactive') {
        finalizeFallback()
        return
      }
      // Let MediaRecorder flush the tail of the audio/video before stopping.
      stopTimer = window.setTimeout(() => {
        stopTimer = 0
        const recorder = fallback?.recorder
        if (!recorder) {
          releaseFallback()
          finishExportState()
          finalized = true
          return
        }
        if (recorder.state === 'inactive') {
          finalizeFallback()
          return
        }
        try {
          recorder.stop()
        } catch (caught) {
          error.value = `Video export could not stop cleanly${caught?.message ? `: ${caught.message}` : '.'}`
          abortFallback('')
        }
      }, TAIL_MS)
      return
    }

    cleanupFailedStart()
  }

  function toggleExport() {
    if (starting) return
    if (exporting.value) {
      requestStop()
      return
    }
    void startExport()
  }

  onBeforeUnmount(() => {
    aborted = true
    ending = true
    clearTimers()
    detachEndedListener()
    if (wc) {
      const session = wc
      void finalizeWebCodecs(session, true)
    }
    if (fallback) {
      if (fallback.recorder && fallback.recorder.state !== 'inactive') {
        try {
          fallback.recorder.stop()
        } catch {
          /* discard below */
        }
      }
      releaseFallback()
    }
    exporting.value = false
    releasePendingUrls()
  })

  return {
    exporting,
    elapsedLabel,
    notice,
    error,
    exportLabel,
    toggleExport
  }
}
