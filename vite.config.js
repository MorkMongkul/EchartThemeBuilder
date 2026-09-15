import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    chunkSizeWarningLimit: 1400,
    rollupOptions: {
      output: {
        manualChunks: {
          echarts: ['echarts'],
          geo: ['./src/data/world-geojson.js', './src/data/cambodia-geojson.js']
        }
      }
    }
  }
});
