import React from "react";
import { CATEGORY_STYLES, DEFAULT_CATEGORY_STYLE } from "@/constants/category";

interface CategoryBadgeProps {
  category: string;
  size?: "sm" | "md";
  variant?: "tint" | "solid";
  className?: string;
}

const CategoryBadge = ({ category, size = "sm", variant = "tint", className = "" }: CategoryBadgeProps) => {
  const categoryStyle = CATEGORY_STYLES[category] ?? DEFAULT_CATEGORY_STYLE;
  const style = {
    color: categoryStyle.foreground,
    backgroundColor: variant === "solid" ? `color-mix(in srgb, ${categoryStyle.background} 88%, white 12%)` : categoryStyle.background,
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border border-white/40 font-bold ${variant === "solid" ? "backdrop-blur-md" : ""} ${size === "md" ? "px-[1rem] py-[0.4rem] text-sm" : "px-[0.8rem] py-[0.25rem] text-xs"} ${className}`}
      style={style}
    >
      {category}
    </span>
  );
};

export default CategoryBadge;
