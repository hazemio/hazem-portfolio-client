import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'react-hot-toast': path.resolve(
        __dirname,
        'node_modules/react-hot-toast/dist/index.js',
      ),
    },
  },
  css: {
    transformer: 'postcss',
  },
  build: {
    cssMinify: false,
    chunkSizeWarningLimit: 10000,
  },
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'http://localhost:3001', changeOrigin: true },
    },
  },
});
