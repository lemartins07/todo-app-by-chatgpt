// @ts-check

export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2016,
      sourceType: 'script',
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly'
      }
    },
    linterOptions: {
      reportUnusedDisableDirectives: true
    },
    rules: {
      'no-var': 'off',
      'prefer-const': 'off',
      'no-unused-vars': 'warn',
      'no-console': 'off',
      semi: ['error', 'always'],
      quotes: ['error', 'single']
    }
  }
];
