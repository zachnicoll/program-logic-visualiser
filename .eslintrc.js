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
  plugins: ["@typescript-eslint", "import"],
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
    "no-shadow": "off",
    "@typescript-eslint/no-shadow": ["error"]
  },
  settings: {
    "import/resolver": {
      "typescript": {},
      "node": {
        "extensions": [".js", ".jsx", ".ts", ".tsx"]
      }
    }
  },
};
