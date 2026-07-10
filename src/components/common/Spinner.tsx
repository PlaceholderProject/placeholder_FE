import { MoonLoader } from "react-spinners";

interface SpinnerProps {
  isLoading: boolean;
  message?: string;
  compact?: boolean;
}

const Spinner = ({ isLoading, message = "불러오는 중", compact = false }: SpinnerProps) => {
  if (!isLoading) return null;

  return (
    <div className={`flex w-full flex-col items-center justify-center ${compact ? "min-h-[4rem]" : "min-h-[22rem] gap-[1rem]"}`} role="status" aria-live="polite">
      <span className={`bg-primary-soft grid place-items-center ${compact ? "h-[3.2rem] w-[3.2rem] rounded-full" : "h-[5.2rem] w-[5.2rem] rounded-[1.7rem]"}`}>
        <MoonLoader color="#6C4DFF" size={compact ? 16 : 24} speedMultiplier={0.85} />
      </span>
      <p className={compact ? "sr-only" : "text-muted-foreground text-sm font-semibold"}>{message}</p>
    </div>
  );
};

export default Spinner;
