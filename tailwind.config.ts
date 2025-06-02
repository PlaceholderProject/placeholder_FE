import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/pages/**/*.{js,ts,jsx,tsx,mdx}", "./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    fontSize: {
      xs: "1rem", // 10px
      sm: "1.2rem", // 12px
      base: "1.4rem", // 14px
      lg: "1.6rem", // 16px
      xl: "1.8rem", // 18px
      "2xl": "2rem", // 20px
      "3xl": "2.6rem", // 24px
      "4xl": "3rem", // 30px
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
          dark: "#868282",
          medium: "#D9D9D9",
          light: "#E8E8E8",
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
