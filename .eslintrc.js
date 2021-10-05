module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["airbnb-base", "prettier"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  rules: {
    "no-console": "off",
    "import/extensions": "off",
    "@typescript-eslint/explicit-function-return-type": "error",
    "no-alert": "off",
    "no-unused-vars": "warn",
    "no-restricted-syntax": "off",
    "no-loop-func": "off",
    "no-param-reassign": "off",
    camelcase: "off",
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
};
