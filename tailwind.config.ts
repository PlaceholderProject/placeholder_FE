import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/pages/**/*.{js,ts,jsx,tsx,mdx}", "./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        pretendard: ["var(--font-pretendard)"],
      },
      screens: {
        // 기존에 sm을 설정해뒀는데,
        // 그럼 모바일 기본으로 css코딩할 때 매번 sm:을 붙여야 하는 거여서
        // 아예 삭제하고
        // 768이하이면 태블릿 사이즈여도 모바일이라고 생각하고 기본 모바일 퍼스트 css, 즉 sm: 없이 코딩,
        // 769px이면 lg 붙여서 하시면 되겠습니다!
        // 제가 잘못 이해한 거면 알려주세요^ㅇ^
        lg: "769px", // PC (769px 이상)
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
