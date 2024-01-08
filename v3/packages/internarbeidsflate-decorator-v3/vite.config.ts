import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';


export default defineConfig({
    plugins: [
      react(),
    ],
    build: {
      cssMinify: true,
      manifest: 'asset-manifest.json',
      rollupOptions: {
        input: "src/index.ts",
        preserveEntrySignatures: "exports-only",
        external: ["react", "react-dom"],
        output: {
          entryFileNames: "bundle.js",
          format: "esm",
          inlineDynamicImports: true,
          assetFileNames: '[name].[ext]', 
        },
      },
    },
});
