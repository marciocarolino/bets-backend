// @ts-check
import { defineConfig } from "eslint/config";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import globals from "globals";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import eslintPluginImport from "eslint-plugin-import";
import boundaries from "eslint-plugin-boundaries";

export default defineConfig([
  // 🚫 Ignorar arquivos problemáticos
  {
    ignores: ["eslint.config.mjs", "dist", "node_modules"],
  },

  // Base ESLint
  eslint.configs.recommended,

  // TypeScript com type-check
  ...tseslint.configs.recommendedTypeChecked,

  // Prettier
  eslintPluginPrettierRecommended,

  // 🔧 Plugins
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
      import: eslintPluginImport,
      boundaries: boundaries,
    },
    languageOptions: {
      parser: tseslint.parser,
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: "commonjs",
    },
  },

  // 🔥 Type-check real
  {
    files: ["**/*.ts"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // 🧠 Clean Architecture (camadas)
  {
    settings: {
      "boundaries/elements": [
        { type: "domain", pattern: "src/app/domain/**" },
        { type: "application", pattern: "src/app/application/**" },
        { type: "infrastructure", pattern: "src/app/infrastructure/**" },
        { type: "interface", pattern: "src/app/interface/**" },
      ],
    },
  },

  // 🧪 TESTES + Prisma (flexível)
  {
    files: [
      "test/**/*.ts",
      "**/*.spec.ts",
      "**/*.e2e-spec.ts",
      "prisma/prisma.service.ts",
    ],
    rules: {
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-return": "off",
    },
  },

  // 🧱 INFRA (Prisma, DB, etc.)
  {
    files: ["src/app/infrastructure/**/*.ts"],
    rules: {
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-return": "off",
    },
  },

  // 🎯 Regras globais
  {
    rules: {
      // TypeScript
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-floating-promises": "warn",
      "@typescript-eslint/no-unsafe-argument": "warn",

      // Prettier
      "prettier/prettier": [
        "error",
        {
          endOfLine: "auto",
          singleQuote: false,
        },
      ],

      // Imports
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",

      // 🔥 Clean Architecture (compatível com sua versão)
      "boundaries/dependencies": [
        "error",
        {
          default: "disallow",
          rules: [
            {
              from: "domain",
              allow: [],
            },
            {
              from: "application",
              allow: ["domain"],
            },
            {
              from: "infrastructure",
              allow: ["domain", "application"],
            },
            {
              from: "interface",
              allow: ["application"],
            },
          ],
        },
      ],
    },
  },
]);