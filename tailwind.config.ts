import type { Config } from "tailwindcss";

const config: Config = {
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#881337",
          secondary: "#881337",
          accent: "#6b7280",
          neutral: "#881337",
          "base-100": "#e5e7eb",
          info: "#1e3a8a",
          success: "#3f6212",
          warning: "#92400e",
          error: "#881337",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {},
};
export default config;
