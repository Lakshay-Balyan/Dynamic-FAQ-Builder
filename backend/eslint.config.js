// backend/eslint.config.js
const globals = require("globals");
const jestPlugin = require("eslint-plugin-jest");

module.exports = [
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "commonjs",
      globals: { ...globals.node },
    },
    rules: {
      "no-console": "warn",
      "no-unused-vars": ["warn", { "caughtErrorsIgnorePattern": "^_" }], // Fixes 'catch (_)' error
    },
  },
  {
    files: ["src/tests/**/*.js"],
    plugins: { jest: jestPlugin },
    rules: { ...jestPlugin.configs.recommended.rules },
    languageOptions: { globals: { ...globals.jest } },
  },
  {
    ignores: ["node_modules/", "coverage/", "dist/"],
  },
];