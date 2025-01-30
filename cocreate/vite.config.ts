import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/cocreate/',
  build: {
    outDir: '../cocreate-qualtrics', // output directory for build
    assetsDir: 'static',  // place assets in a static folder under cocreate-qualtrics
  }
})
