module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  plugins: ["react-refresh"],
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "no-console": "warn", // Warns against using console.log() and similar functions
    "no-unused-vars": "warn", // Warns about unused variables
    "no-undef": "error", // Throws an error for undeclared variables
    "no-extra-semi": "warn", // Warns about unnecessary semicolons
    "no-empty": "error", // Throws an error for empty blocks/statements
    "no-multiple-empty-lines": ["warn", { max: 2 }], // Warns about multiple empty lines
    indent: ["warn", 2, { "SwitchCase": 1 }], // Warns about incorrect indentation (2 spaces)
    semi: ["warn", "always"], // Warns about missing semicolons
    quotes: ["warn", "double"], // Warns about using double quotes instead of single quotes
  },
};
