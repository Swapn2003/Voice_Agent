import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'voice-agent-lib': path.resolve(__dirname, '../voice-agent-lib/src')
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/voice-agent': {
        target: 'http://localhost:8081',
        changeOrigin: true
      },
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
});


