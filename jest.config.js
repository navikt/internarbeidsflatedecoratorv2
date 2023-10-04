/** @type {import('ts-jest').JestConfigWithTsJest} */
const config = {
    testEnvironment: 'jsdom',
    extensionsToTreatAsEsm: ['.ts', '.tsx'],
    setupFiles: ['./setupTests.js'],
    globals: {
        fetch: global.fetch
    },
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                useESM: true,
                tsconfig: 'tsconfig.test.json',
                babelConfig: {
                    plugins: ['babel-plugin-transform-vite-meta-env']
                }
            }
        ]
    }
};
export default config;
