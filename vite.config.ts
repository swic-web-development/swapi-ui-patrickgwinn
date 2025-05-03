// vite.config.ts
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    // Enable hot module replacement
    hmr: true,
    // Open browser on start
    open: true,
    // Configure port
    port: 3000,
  },
  // Configure base path
  base: './',
  // Build options
  build: {
    outDir: 'dist',
    // Generate sourcemaps for production build
    sourcemap: true,
  },
  // Resolve options
  resolve: {
    // Configure aliases
    alias: {
      '@': '/src',
    },
  },
})
