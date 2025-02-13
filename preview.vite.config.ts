import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/internarbeidsflatedecorator/',
  build: {
    target: 'es2022',
    cssMinify: true,
    minify: true,
  },
});
