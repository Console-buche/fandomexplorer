import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import react from '@vitejs/plugin-react';
import path, { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), vanillaExtractPlugin()],
  base: '/fandomexplorer/',
  root: join(dirname(fileURLToPath(new URL(import.meta.url))), '/'),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@fonts': '/fonts',
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (_path) => _path.replace(/^\/api/, ''),
      },
    },
  },
});
