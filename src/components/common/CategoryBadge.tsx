import React from "react";
import { CATEGORY_BADGE_COLOR } from "@/constants/category";

interface CategoryBadgeProps {
  category: string;
  size?: "sm" | "md";
  variant?: "tint" | "solid";
  className?: string;
}

// 카테고리 색상 뱃지 (카드 좌상단 등에서 재사용)
// 색상은 통일(브랜드 컬러), 이모지는 표시하지 않음.
// - tint: 반투명 톤온톤 (기본, 밝은 배경용)
// - solid: 반투명 흰 배경 + 백드롭 블러 + 컬러 텍스트 (어두운 이미지 오버레이용, 블러감 + 대비 확보)
const CategoryBadge = ({ category, size = "sm", variant = "tint", className = "" }: CategoryBadgeProps) => {
  const color = CATEGORY_BADGE_COLOR;

  const style = variant === "solid" ? { color, backgroundColor: "rgba(255, 255, 255, 0.72)" } : { color, backgroundColor: `color-mix(in srgb, ${color} 14%, transparent)` };

  return (
    <span
      className={`inline-flex items-center rounded-full ${variant === "solid" ? "font-semibold backdrop-blur-md" : "font-medium"} ${size === "md" ? "px-[0.9rem] py-[0.3rem] text-sm" : "px-[0.7rem] py-[0.2rem] text-xs"} ${className}`}
      style={style}
    >
      {category}
    </span>
  );
};

export default CategoryBadge;
