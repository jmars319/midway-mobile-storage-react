module.exports = {
  root: true,
  ignorePatterns: ['dist', 'node_modules'],
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true }
  },
  settings: {
    react: { version: 'detect' }
  },
  globals: {
    describe: 'readonly',
    it: 'readonly',
    expect: 'readonly',
    vi: 'readonly'
  },
  rules: {
    'react/prop-types': 'off'
  }
}
