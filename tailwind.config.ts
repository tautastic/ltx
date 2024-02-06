import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config = {
  content: ["./src/pages/**/*.{js,ts,jsx,tsx}", "./src/components/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("tailwindcss-animate"),
  ],
  theme: {
    screens: {
      "xs": "540px",
      "sm": "640px",
      "md": "768px",
      "lg": "1024px",
      "xl": "1280px",
      "2xl": "1536px",
    },
    borderRadius: {
      "none": "0",
      "sm": "2px",
      "DEFAULT": "5px",
      "md": "6px",
      "lg": "8px",
      "xl": "10px",
      "2xl": "12px",
      "3xl": "16px",
      "full": "9999px",
    },
    colors: {
      white: "#FFFFFF",
      black: "#000000",
      selection: {
        DEFAULT: "#79FFE1",
        dark: "#F81CE5",
      },
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
        100: "#FFD5D5",
        200: "#FFA8A8",
        300: "#FF7575",
        400: "#FF4242",
        500: "#FF0000",
        600: "#E50000",
        700: "#B10000",
        800: "#7D0000",
        900: "#341418",
      },
      yellow: {
        50: "#FFF5C2",
        100: "#FFE8A3",
        200: "#FFD164",
        300: "#FFB700",
        400: "#F5A623",
        500: "#D18600",
        600: "#AB6700",
        700: "#884D00",
        800: "#663B00",
        900: "#41320C",
      },
    },
    fontSize: {
      "xxs": ["0.75rem", { lineHeight: "1rem" }],
      "xs": ["0.8rem", { lineHeight: "1rem" }],
      "sm": ["0.875rem", { lineHeight: "1.25rem" }],
      "base": ["1rem", { lineHeight: "1.5rem" }],
      "lg": ["1.125rem", { lineHeight: "1.75rem" }],
      "xl": ["1.25rem", { lineHeight: "1.75rem" }],
      "2xl": ["1.5rem", { lineHeight: "2rem" }],
      "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
      "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
      "5xl": ["3rem", { lineHeight: "1" }],
      "5.5xl": ["3.5rem", { lineHeight: "1" }],
      "6xl": ["3.75rem", { lineHeight: "1" }],
      "7xl": ["4.5rem", { lineHeight: "1" }],
      "7.5xl": ["5.25rem", { lineHeight: "1" }],
      "8xl": ["6rem", { lineHeight: "1" }],
      "9xl": ["8rem", { lineHeight: "1" }],
    },
    extend: {
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      borderWidth: {
        px: "1px",
      },
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "--radix-accordion-content-height" },
        },
        "accordion-up": {
          from: { height: "--radix-accordion-content-height" },
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
} satisfies Config;

export default config;
