/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    // preset: 'ts-jest',
    testEnvironment: 'jsdom',
    extensionsToTreatAsEsm: ['.ts', '.tsx'],
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                useESM: true,
                // tsconfig: 'tsconfig.test.json',
                // isolatedModules: false,
                babelConfig: {
                    plugins: [
                        "babel-preset-vite",
                        // 'babel-plugin-transform-import-meta'
                    ]
                }
            }
        ]
    }
};
