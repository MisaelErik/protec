import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}']
      },
      manifest: {
        name: 'Panel de Control de Privacidad',
        short_name: 'Privacidad Panel',
        description: 'Todo lo que tu navegador sabe y puede hacer sin que te des cuenta',
        theme_color: '#111827',
        background_color: '#111827',
        display: 'standalone',
        icon: 'public/favicon.ico'
      }
    })
  ],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          network: ['src/services/NetworkService.js'],
          device: ['src/services/DeviceService.js'],
          privacy: ['src/services/PrivacyService.js'],
          security: ['src/services/SecurityService.js']
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
});