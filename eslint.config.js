import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  eslint.configs.recommended,
  prettier,
  ...tseslint.configs.recommendedTypeChecked,
  {
    ignores: ['**/dist/**/*',],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json', './packages/*/tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ['**/*.js','vitest.workspace.ts'],
    extends: [tseslint.configs.disableTypeChecked]
  }
);
