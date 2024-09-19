import type { Config } from "tailwindcss";
import animatePlugin from "tailwindcss-animate";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "selector",
  theme: {
    extend: {
      colors: {
        cust: {
          // primary
          prim: {
            DEFAULT: "#635FC7",
            light: "#A8A4FF",
          },
          destructive: {
            DEFAULT: "#EA5555",
            light: "#FF9898",
          },
          slate: {
            0: "rgb(var(--color-slate-0) / <alpha-value>)", // white
            100: "rgb(var(--color-slate-100) / <alpha-value>)",
            200: "rgb(var(--color-slate-200) / <alpha-value>)",
            300: "rgb(var(--color-slate-300) / <alpha-value>)",
            // 400: "#3E3F4E",
            // 500: "#2B2C37",
            // 600: "#20212C",
            // 700: "#000112",
            1000: "rgb(var(--color-slate-1000) / <alpha-value>)",
          },
        },
      },
    },
  },
  plugins: [animatePlugin],
};
export default config;

// Text Black -> Text White
//
