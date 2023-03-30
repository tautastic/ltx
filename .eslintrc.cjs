/** @type {import("eslint").Linter.Config} */
const config = {
  plugins: ["@typescript-eslint"],
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      extends: [
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "plugin:@typescript-eslint/recommended",
      ],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: "./tsconfig.json",
      },
      rules: {
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/consistent-type-imports": [
          "warn",
          {
            prefer: "type-imports",
            fixStyle: "inline-type-imports",
          },
        ],
        "@typescript-eslint/consistent-type-exports": "warn",
        "@typescript-eslint/member-ordering": [
          "warn",
          {
            interfaces: {
              order: "alphabetically",
            },
            typeLiterals: {
              order: "alphabetically",
            },
          },
        ],
      },
    },
  ],
  extends: ["next/core-web-vitals"],
};

module.exports = config;
