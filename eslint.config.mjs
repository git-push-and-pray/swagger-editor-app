import globals from 'globals';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';
import reactCompiler from 'eslint-plugin-react-compiler';
import unusedImports from 'eslint-plugin-unused-imports';
import importPlugin from 'eslint-plugin-import';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  ...tseslint.configs.strict,

  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'coverage/**',
    'node_modules/**',
    'next-env.d.ts',
    '**/*.config.js',
    '**/*.config.ts',
  ]),

  eslintConfigPrettier,
  eslintPluginPrettier,

  {
    files: ['**/*.{ts,tsx}'],

    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },

    plugins: {
      'react-compiler': reactCompiler,
      'unused-imports': unusedImports,
      import: importPlugin,
      'simple-import-sort': simpleImportSort,
    },

    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
          alwaysTryTypes: true,
        },
      },
    },

    rules: {
      'react-compiler/react-compiler': 'error',
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^react', String.raw`^@?\w`],
            ['^@/'],
            [
              String.raw`^\.\.(?!/?$)`,
              String.raw`^\.\./?$`,
              String.raw`^\./(?=.*/)(?!/?$)`,
              String.raw`^\./?$`,
              String.raw`^\.(?!/?$)`,
            ],
            [String.raw`^.+\.s?css$`],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
      'import/no-duplicates': 'error',
      'import/no-unresolved': 'error',
      'unused-imports/no-unused-imports': 'error',
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-vars': [
        'warn',
        { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
        },
      ],
    },
  },
]);
