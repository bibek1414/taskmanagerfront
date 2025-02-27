import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // This sets up the alias for @ to map to the src folder
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://taskmangerback.onrender.com',
        changeOrigin: true,
        secure: false,
      }
    }
  }
});
