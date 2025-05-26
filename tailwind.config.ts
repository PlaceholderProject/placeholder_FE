import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/pages/**/*.{js,ts,jsx,tsx,mdx}", "./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    fontSize: {
      xs: "1.2rem", // 12px
      sm: "1.4rem", // 14px
      base: "1.6rem", // 16px
      lg: "1.8rem", // 18px
      xl: "2rem", // 20px
      "2xl": "2.4rem", // 24px
      "3xl": "3rem", // 30px
      "4xl": "3.6rem", // 36px
      "5xl": "4.8rem", // 48px
      "6xl": "6.4rem", // 64px
      "7xl": "7.2rem", // 72px
    },
    extend: {
      fontFamily: {
        pretendard: ["var(--font-pretendard)"],
      },
      screens: {
        lg: { min: "769px" }, // PC (769px 이상)
      },
      colors: {
        primary: "#006B8B",
        secondary: {
          dark: "#FBFFA9",
          light: "#FEFFEC",
        },
        gray: {
          dark: "#484848",
          medium: "#858585",
          light: "#C4C4C4",
        },

        error: "#F9617A",
        warning: "#F9617A",

        dimmer: {
          900: "#17171980", //#171719에 투명도 50%
        },
      },
    },
  },
  plugins: [],
};
export default config;
