<template>
  <a class="skip-link" href="#projects">Skip to projects</a>
  <Navbar />
  <main>
    <Hero />
    <Projects />
    <Timeline />
    <About />
    <Resume />
    <Contact />
  </main>
  <Footer />
</template>

<script setup>
import Navbar from './components/Navbar.vue'
import Hero from './components/Hero.vue'
import Projects from './components/Projects.vue'
import Timeline from './components/Timeline.vue'
import About from './components/About.vue'
import Resume from './components/Resume.vue'
import Contact from './components/Contact.vue'
import Footer from './components/Footer.vue'
</script>
