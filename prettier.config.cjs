/** @type {import("prettier").Config} */
const config = {
  semi: true,
  tabWidth: 2,
  useTabs: false,
  printWidth: 100,
  endOfLine: "lf",
  singleQuote: false,
  proseWrap: "always",
  bracketSpacing: true,
  trailingComma: "es5",
  arrowParens: "always",
  jsxSingleQuote: false,
  quoteProps: "consistent",
  bracketSameLine: false,
  singleAttributePerLine: false,
  plugins: [require.resolve("prettier-plugin-tailwindcss")],
  overrides: [
    {
      files: "*.css",
      options: {
        printWidth: 9999,
      },
    },
  ],
};

module.exports = config;
