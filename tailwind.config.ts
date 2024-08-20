import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "selector",
  theme: {
    extend: {
      colors: {
        x: {
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
            0: "#FFFFFF", // white
            100: "#F4F7FD",
            200: "#E4EBFA",
            300: "#828FA3",
            400: "#3E3F4E",
            500: "#2B2C37",
            600: "#20212C",
            700: "#000112",
          },
        },
      },
    },
  },
  plugins: [],
};
export default config;
