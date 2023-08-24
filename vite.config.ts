import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        manifest: 'asset-manifest.json',
        outDir: 'build',
        sourcemap: true
    }
});
