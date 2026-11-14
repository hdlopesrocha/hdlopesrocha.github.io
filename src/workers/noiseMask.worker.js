import { cloudNoise, smoothstep } from '../lib/perlin'

self.onmessage = (event) => {
  const {
    width,
    height,
    scale,
    drift,
    noiseTime,
    octaves,
    amplitude,
    gain,
    lacunarity,
    contrast,
    brightness
  } = event.data

  const data = new Uint8ClampedArray(width * height * 4)
  const edge = 0.3 - 0.25 * Math.min(1, Math.max(0, contrast))
  let offset = 0

  for (let y = 0; y < height; y += 1) {
    const ny = y / (height - 1)
    for (let x = 0; x < width; x += 1) {
      const nx = x / (width - 1)
      const n = cloudNoise(nx * scale + drift, ny * scale * 1.23, noiseTime, {
        octaves,
        amplitude,
        gain,
        lacunarity
      })
      const density = smoothstep(0.5 - edge, 0.5 + edge, n)
      data[offset] = 255
      data[offset + 1] = 255
      data[offset + 2] = 255
      data[offset + 3] = Math.round(
        Math.min(1, (0.15 + 0.85 * density) * brightness) * 255
      )
      offset += 4
    }
  }

  self.postMessage({ data, width, height }, [data.buffer])
}
