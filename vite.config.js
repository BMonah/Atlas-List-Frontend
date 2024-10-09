import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Set the IP address (0.0.0.0 binds to all available network interfaces)
    port: 3000,      // Set the port number
  },
  build: {
    chunkSizeWarningLimit: 1000,
  }
})
