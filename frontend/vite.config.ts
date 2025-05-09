import { defineConfig } from 'vite'
import path from 'path';
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, 'src') }
    ]
  },
  plugins: [
    react(), 
    tailwindcss(),
  ],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5234",
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
