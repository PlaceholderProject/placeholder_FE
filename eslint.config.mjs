import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  prettier,
  {
    rules: {
      // 기존 폼·필터 상태 동기화 패턴은 기능 단위 리팩터링 시 단계적으로 제거합니다.
      "react-hooks/set-state-in-effect": "off",
    },
  },
  globalIgnores([".next*/**", "node_modules/**", "Redesign Project Mockup/**"]),
]);
