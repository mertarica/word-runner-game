module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "plugin:eslint-plugin-jest/recommended",
  ],
  overrides: [
    {
      files: ["__tests__/**"],
      plugins: ["jest"],
      env: { "jest/globals": true },
      extends: ["plugin:jest/recommended"],
      rules: {
        "jest/prefer-expect-assertions": "off",
        "jest/no-alias-methods": "error",
        "jest/no-focused-tests": "error",
        "jest/no-identical-title": "error",
        "jest/require-to-throw-message": "error",
        "jest/valid-expect": "error",
      },
    },
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  plugins: ["react-refresh", "jest"],
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "no-console": "warn", // Warns against using console.log() and similar functions
    "no-unused-vars": "off", // Warns about unused variables
    "@typescript-eslint/no-unused-vars": ["error"],
    "no-undef": "error", // Throws an error for undeclared variables
    "no-extra-semi": "warn", // Warns about unnecessary semicolons
    "no-empty": "error", // Throws an error for empty blocks/statements
    "no-multiple-empty-lines": ["warn", { max: 2 }], // Warns about multiple empty lines
    indent: ["warn", 2, { SwitchCase: 1 }], // Warns about incorrect indentation (2 spaces)
    semi: ["warn", "always"], // Warns about missing semicolons
    quotes: ["warn", "double"], // Warns about using double quotes instead of single quotes
    "react-refresh/only-export-components": "warn"
  },
};
