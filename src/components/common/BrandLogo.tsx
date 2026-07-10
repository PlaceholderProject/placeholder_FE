interface BrandLogoProps {
  inverse?: boolean;
  className?: string;
}

const BrandLogo = ({ inverse = false, className = "" }: BrandLogoProps) => {
  return (
    <span
      role="img"
      aria-label="Placeholder"
      className={`block h-[2.65rem] w-[11.8rem] shrink-0 md:h-[2.9rem] md:w-[12.9rem] ${className}`}
      style={{
        backgroundColor: inverse ? "#FFFFFF" : "#6C4DFF",
        WebkitMask: 'url("/logo.png") center / contain no-repeat',
        mask: 'url("/logo.png") center / contain no-repeat',
      }}
    />
  );
};

export default BrandLogo;
