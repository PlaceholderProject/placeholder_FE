import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/pages/**/*.{js,ts,jsx,tsx,mdx}", "./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        pretendard: ["var(--font-pretendard)"],
      },
      screens: {
        sm: { max: "768px" }, // 모바일 (768px 이하)
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
