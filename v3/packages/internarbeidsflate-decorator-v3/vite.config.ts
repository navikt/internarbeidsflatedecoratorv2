import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path'


export default defineConfig(({ mode }) => {
  return {
    plugins: [
      react({ jsxRuntime: 'classic' }),
    ],
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode)
    },
    build: {
      minify: true,
      cssMinify: true,
      manifest: 'asset-manifest.json',
      lib: {
        formats: ['umd'],
        entry: path.resolve(__dirname, 'src/index.ts'),
        name: 'InternarbeidsFlateDecoratorV3',
        fileName: (fileEnding) => `internarbeidsflate-decorator-v3.${fileEnding}.js`
      },
    },
  }
});
