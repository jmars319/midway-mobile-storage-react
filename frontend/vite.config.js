import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { 
    port: 3000,
    open: '/' // Open to public homepage instead of admin
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setupTests.js',
    globals: true
  }
})
