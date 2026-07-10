import { CSSProperties } from "react";

interface SegmentedIndicatorProps {
  count: number;
  index: number;
  className: string;
}

const SegmentedIndicator = ({ count, index, className }: SegmentedIndicatorProps) => {
  const hasSelection = index >= 0;
  const style: CSSProperties = {
    width: `calc((100% - 0.6rem) / ${count})`,
    transform: `translate3d(${Math.max(index, 0) * 100}%, 0, 0)`,
  };

  return (
    <span
      aria-hidden="true"
      style={style}
      className={`pointer-events-none absolute top-[0.3rem] bottom-[0.3rem] left-[0.3rem] transition-[transform,opacity] duration-[260ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform ${
        hasSelection ? "opacity-100" : "opacity-0"
      } ${className}`}
    />
  );
};

export default SegmentedIndicator;
