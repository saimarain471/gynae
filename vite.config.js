import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('lucide-react')) {
            return 'icons';
          }
          if (id.includes('@supabase/supabase-js')) {
            return 'supabase';
          }
          if (id.includes('framer-motion')) {
            return 'framer-motion';
          }
        }
      }
    }
  },
})
