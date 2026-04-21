import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-public-sans)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
