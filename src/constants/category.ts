type CategoryStyle = {
  foreground: string;
  background: string;
};

export const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  운동: { foreground: "#B83252", background: "#FFE5EC" },
  공부: { foreground: "#2D5FC5", background: "#E7F0FF" },
  취준: { foreground: "#6042CF", background: "#EEE9FF" },
  취미: { foreground: "#A93686", background: "#FBE8F6" },
  친목: { foreground: "#8F6200", background: "#FFF1C7" },
  맛집: { foreground: "#B94E18", background: "#FFE8D8" },
  여행: { foreground: "#08766F", background: "#DDF6F2" },
  기타: { foreground: "#5C5A66", background: "#EEEDEF" },
};

export const DEFAULT_CATEGORY_STYLE: CategoryStyle = {
  foreground: "#4930B8",
  background: "#EFEBFF",
};
