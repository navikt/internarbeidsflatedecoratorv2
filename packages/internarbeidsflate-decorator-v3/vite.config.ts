import { defineConfig } from 'vite';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';


export default defineConfig({
    plugins: [
      react(),
      // Plugin som velger hvilken html-fil som skal brukes av dev-serveren
      {
        name: 'html-transform',
        transformIndexHtml: {
          order: 'pre',
          handler() {
            const htmlPath = process.env.INTERNARBEIDSFLATE_DECORATOR_HTML_PATH || 'index.html';
            return readFileSync(resolve(__dirname, htmlPath), 'utf-8');
          }
        }
      }
    ],
    build: {
      cssMinify: true,
      minify: true,
      manifest: 'asset-manifest.json',
      rollupOptions: {
        input: 'src/index.ts',
        preserveEntrySignatures: 'exports-only',
        // external: ["react", "react-dom"],
        output: {
          entryFileNames: 'bundle.js',
          // format: "iife",
          inlineDynamicImports: true,
          assetFileNames: '[name].[ext]'
        }
      }
    }
  }
);
