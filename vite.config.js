import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base:"./",
  build: {
    //target: 'esnext' //browsers can handle the latest ES features
    chunkSizeWarningLimit: 1600,
    target:'esnext'
  }
})
