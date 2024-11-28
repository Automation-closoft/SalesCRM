import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite config for React app
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',  // Specify the output directory for the build
  },
})
