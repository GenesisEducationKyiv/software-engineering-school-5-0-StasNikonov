const js = require("@eslint/js");
const globals = require("globals");
const { defineConfig } = require("eslint/config");
const prettierPlugin = require("eslint-plugin-prettier");

module.exports = defineConfig([
  {
    ignores: ["dist", "node_modules"],
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    plugins: {
      js,
      prettier: prettierPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      "prettier/prettier": "error",
      "linebreak-style": ["off"],
    },
  },
]);
