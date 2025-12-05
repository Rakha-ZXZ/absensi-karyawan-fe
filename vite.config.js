import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Panduan Konfigurasi Vite
// 1. Jalankan server backend (Express.js) di port 5000.
// 2. Jalankan server frontend (Vite) Anda.
// 3. Permintaan dari React ke '/api/...' akan di-proxy ke http://localhost:5000/api/...

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Mengarahkan semua request yang dimulai dengan /api ke backend
      '/api': {
        target: 'http://localhost:5000', // Alamat server Express.js Anda
        changeOrigin: true, // Diperlukan untuk host virtual
        secure: false, // Gunakan false jika backend Anda adalah HTTP (localhost)
      },
    },
  },
});