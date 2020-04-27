/*
.eslintrc.js
*/

const ERROR = 2;
const WARN = 1;

module.exports = {
  extends: "eslint:recommended",
  env: {
  es6: true
  },
  overrides: [
    Object.assign(
      {
        files: [ '**/*.test.js' ],
        env: { jest: true },
        plugins: [ 'jest' ],
      },
      require('eslint-plugin-jest').configs.recommended
    )
  ]
};