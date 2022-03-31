import { defineConfig } from 'vite'
import legacy from '@vitejs/plugin-legacy'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(() => ({
  plugins: [
    VitePWA(),
    legacy({
      targets: ['defaults', 'not IE 11']
    })
  ]
}))
