import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

// React Compiler memoises for us (see CLAUDE.md), so manual memoisation is banned.
const noManualMemo = {
  paths: [
    {
      name: 'react',
      importNames: ['useMemo', 'useCallback', 'memo'],
      message: 'React Compiler handles memoisation; remove manual useMemo/useCallback/memo.',
    },
  ],
};

export default defineConfig([
  globalIgnores([
    'dist',
    'coverage',
    'public/assets',
    'playwright-report',
    'test-results',
    'assets',
  ]),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.strictTypeChecked,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      jsxA11y.flatConfigs.recommended,
    ],
    languageOptions: {
      ecmaVersion: 2023,
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      'no-restricted-imports': ['error', noManualMemo],
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ExportDefaultDeclaration',
          message: 'Use named exports. Default exports are only for route/lesson entry points.',
        },
        {
          selector:
            "MemberExpression[object.name='React'][property.name=/^(useMemo|useCallback|memo)$/]",
          message: 'React Compiler handles memoisation; remove manual useMemo/useCallback/memo.',
        },
      ],
    },
  },
  {
    // Route entry points, config files and tooling may use default exports.
    files: ['src/app/routes/**', '*.config.{ts,js}'],
    rules: { 'no-restricted-syntax': 'off' },
  },
  {
    files: ['scripts/**/*.mjs'],
    extends: [js.configs.recommended],
    languageOptions: { globals: globals.node },
  },
  prettier,
]);
