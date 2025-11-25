module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
  },
  plugins: [
    "react",
    "react-hooks",
    "jsx-a11y",
    "prettier",
  ],
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:prettier/recommended"
  ],
  settings: {
    react: {
      version: "detect",
    },
  },
  plugins: ["react", "react-hooks", "jsx-a11y", "prettier", "react-refresh"],
   rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
};
