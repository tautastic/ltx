const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/pages/**/*.{js,ts,jsx,tsx}", "./src/components/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  plugins: [
    require("@tailwindcss/forms"),
    // @ts-ignore
    require("tailwindcss-animate"),
    require("@tailwindcss/line-clamp"),
  ],
  theme: {
    colors: {
      white: "#FFFFFF",
      black: "#000000",
      selection: "#F81CE5",
      current: "currentColor",
      transparent: "transparent",
      blue: {
        50: "#F3FBFF",
        100: "#DDF2FF",
        200: "#A9DFFE",
        300: "#73C7F9",
        400: "#47B7F8",
        500: "#1E9DE7",
        600: "#0E73CC",
        700: "#144EB6",
        800: "#0E3682",
        900: "#08204E",
      },
      gray: {
        50: "#fafafa",
        100: "#ebebeb",
        200: "#e1e1e1",
        300: "#c1c1c1",
        400: "#a1a1a1",
        500: "#818181",
        600: "#616161",
        700: "#414141",
        800: "#333333",
        850: "#1a1a1a",
        900: "#111111",
        950: "#0a0a0a",
      },
      green: {
        50: "#EFFFF3",
        100: "#D7FBDF",
        200: "#A9ECB8",
        300: "#75DB8C",
        400: "#40D763",
        500: "#27B648",
        600: "#13862E",
        700: "#19652A",
        800: "#10481D",
        900: "#0A2B13",
      },
      orange: {
        50: "#fff8f3",
        100: "#ffe8d8",
        200: "#ffc59b",
        300: "#fc9c66",
        400: "#fd812d",
        500: "#f35815",
        600: "#c43c02",
        700: "#962d00",
        800: "#672002",
        900: "#3c1403",
      },
      purple: {
        50: "#F9F8FF",
        100: "#EEEAFF",
        200: "#D4C9FE",
        300: "#B7A5FB",
        400: "#A18BF5",
        500: "#8467F3",
        600: "#624BBB",
        700: "#4B3990",
        800: "#3E1F75",
        900: "#27124A",
      },
      red: {
        50: "#FFFAFA",
        100: "#FFE5E9",
        200: "#FBBFC7",
        300: "#FF909F",
        400: "#FF7082",
        500: "#FF455D",
        600: "#DD243C",
        700: "#C11027",
        800: "#8F0718",
        900: "#341418",
      },
      yellow: {
        50: "#FFFBE4",
        100: "#FFF1A8",
        200: "#FED54A",
        300: "#F2B600",
        400: "#D19F03",
        500: "#A78103",
        600: "#835C01",
        700: "#5C4716",
        800: "#41320C",
        900: "#281E03",
      },
    },
    extend: {
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      borderWidth: {
        px: "1px",
      },
      boxShadow: {
        sm: "0px 1px 2px rgba(0, 0, 0, 0.05)",
        md: "0 1px 2px 0 rgba(0, 0, 0, .2), 0 1px 3px 0 rgba(0, 0, 0, .1)",
        lg: "0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)",
        xl: "0 20px 25px -5px rgba(0,0,0,0.1),0 10px 10px -5px rgba(0,0,0,0.04)",
      },
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "text-fade-fg-1": {
          "0%, 16.667%, to": {
            opacity: "1",
          },
          "33.333%, 83.333%": {
            opacity: "0",
          },
        },
        "text-fade-bg-1": {
          "0%, 16.667%, to": {
            opacity: "0",
          },
          "25%, 91.667%": {
            opacity: "1",
          },
        },
        "text-fade-fg-2": {
          "0%, to": {
            opacity: "0",
          },
          "33.333%, 50%": {
            opacity: "1",
          },
          "16.667%, 66.667%": {
            opacity: "0",
          },
        },
        "text-fade-bg-2": {
          "0%, to": {
            opacity: "1",
          },
          "33.333%, 50%": {
            opacity: "0",
          },
          "25%, 58.333%": {
            opacity: "1",
          },
        },
        "text-fade-fg-3": {
          "0%, 50%, to": {
            opacity: "0",
          },
          "66.667%, 83.333%": {
            opacity: "1",
          },
        },
        "text-fade-bg-3": {
          "0%, 58.333%, 91.667%, to": {
            opacity: "1",
          },
          "66.667%, 83.333%": {
            opacity: "0",
          },
        },
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(.25,1.6,.5,.8)",
      },
      zIndex: {
        "-1": "-1",
      },
    },
  },
};

module.exports = config;
