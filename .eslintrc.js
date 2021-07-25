module.exports = {
  root: true,
  parser: 'vue-eslint-parser',
  plugins: [
    '@typescript-eslint'
  ],
  extends: [
    'standard-with-typescript',
    'plugin:vue/vue3-recommended'
  ],
  parserOptions: {
    project: './tsconfig.eslint.json',
    parser: '@typescript-eslint/parser',
    extraFileExtensions: ['.vue']
  }
}
