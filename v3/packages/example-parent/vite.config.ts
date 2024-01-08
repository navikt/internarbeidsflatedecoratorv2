import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    minify: false,
    rollupOptions: {
      preserveEntrySignatures: "exports-only",
      external: ["react", "react-dom"],
    }
  },
  preview: {
    port: 3001 
  }
})
