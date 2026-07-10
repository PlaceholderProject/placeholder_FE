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
        md: { min: "769px" }, // 명시하든 안 하든 똑같음 (기본값)
        lg: { min: "1024px" }, // PC (1024px 이상), 추후 사용 가능성
      },
      colors: {
        primary: {
          DEFAULT: "#6C4DFF",
          hover: "#5B3EE8",
          foreground: "#FFFFFF",
          soft: "#EFEBFF",
          "soft-foreground": "#4930B8",
        },
        secondary: {
          dark: "#DDFB52",
          light: "#F4FFD0",
        },
        background: "#F7F6F2",
        foreground: "#18171D",
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#18171D",
        },
        muted: {
          DEFAULT: "#EFEEE9",
          foreground: "#77746D",
        },
        accent: {
          DEFAULT: "#DDFB52",
          foreground: "#20280A",
        },
        destructive: {
          DEFAULT: "#E5485D",
          foreground: "#FFFFFF",
        },
        success: {
          DEFAULT: "#2F9E75",
          soft: "#E5F7F0",
        },
        border: "rgba(24, 23, 29, 0.10)",
        gray: {
          dark: "#868282",
          medium: "#D9D9D9",
          light: "#E8E8E8",
        },
        error: "#E5485D",
        warning: "#E5485D",

        dimmer: {
          900: "#17171980", //#171719에 투명도 50%
        },
      },
    },
  },
  plugins: [],
};
export default config;
