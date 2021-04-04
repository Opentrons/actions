'use strict'

module.exports = {
  root: true,
  extends: ['standard-with-typescript', 'prettier'],
  ignorePatterns: ['**/lib/**', '**/dist/**'],
  parserOptions: {
    project: './*/tsconfig.json',
  },
  rules: {
    '@typescript-eslint/promise-function-async': 'off',
  },
  overrides: [
    {
      files: '**/__tests__/**',
      rules: { '@typescript-eslint/consistent-type-assertions': 'off' },
    },
  ],
}
