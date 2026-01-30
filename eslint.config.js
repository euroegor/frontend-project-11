import js from '@eslint/js'
import globals from 'globals'
import { defineConfig } from 'eslint/config'
import stylistic from '@stylistic/eslint-plugin'

export default defineConfig([
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      globals: globals.browser,
    },
    plugins: {
  js,
  '@stylistic': stylistic,
},
    extends: ['js/recommended'],
    rules: {
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/semi': ['error', 'never'],
      '@stylistic/eol-last': 'error',
      '@stylistic/arrow-parens': ['error', 'as-needed'],
      '@stylistic/operator-linebreak': ['error', 'before'],
      '@stylistic/brace-style': ['error', '1tbs'],
    },
  },
])
