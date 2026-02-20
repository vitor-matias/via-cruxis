import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    legacy({
      targets: ['firefox >= 48'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime']
    })
  ],
  base: './',
})

