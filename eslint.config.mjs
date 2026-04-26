// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import eslintPluginImport from 'eslint-plugin-import';
import boundaries from 'eslint-plugin-boundaries';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
      import: eslintPluginImport, boundaries
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings:{
      'boundaries/elements':[
        {type: 'domain', pattern:'src/app/domain/**'},
        { type: 'application', pattern: 'src/app/application/**' },
        { type: 'infrastructure', pattern: 'src/app/infrastructure/**' },
        { type: 'interface', pattern: 'src/app/interface/**' },
      ]
    }
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      "prettier/prettier": ["error", { endOfLine: "auto" }],
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      'boundaries/element-types': [
    'error',
    {
      default: 'disallow',
      rules: [
        {
          from: 'domain',
          allow: [],
        },
        {
          from: 'application',
          allow: ['domain'],
        },
        {
          from: 'infrastructure',
          allow: ['domain', 'application'],
        },
        {
          from: 'interface',
          allow: ['application'],
        },
      ],
    },
  ],
    },
  },
);
