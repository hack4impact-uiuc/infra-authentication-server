module.exports = {
  parserOptions: {
    ecmaVersion: 9,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: [
    "mocha"
  ],
  extends: "eslint:recommended",
  env: {
    amd: true,
    node: true,
    es6: true,
    mocha: true
  },
  rules: {
    "no-console": "off",
    "mocha/no-exclusive-tests": "error"
  }
};
