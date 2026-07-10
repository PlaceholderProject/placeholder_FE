import Link from "next/link";
import { LuArrowRight, LuSparkles } from "react-icons/lu";

interface MySpaceEmptyStateProps {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}

const MySpaceEmptyState = ({ title, description, actionHref, actionLabel }: MySpaceEmptyStateProps) => {
  return (
    <div className="border-border bg-card flex min-h-[20rem] flex-col items-center justify-center rounded-[2.2rem] border border-dashed px-[2rem] text-center">
      <span className="bg-primary-soft text-primary mb-[1.2rem] grid h-[4.8rem] w-[4.8rem] place-items-center rounded-[1.6rem]">
        <LuSparkles className="h-[2.1rem] w-[2.1rem] stroke-[1.9]" />
      </span>
      <h3 className="text-foreground text-base font-black">{title}</h3>
      <p className="text-muted-foreground mt-[0.45rem] max-w-[32rem] text-sm leading-relaxed break-keep">{description}</p>
      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="bg-foreground text-background mt-[1.4rem] inline-flex h-[3.8rem] items-center gap-[0.55rem] rounded-full px-[1.4rem] text-sm font-bold transition hover:opacity-85"
        >
          {actionLabel}
          <LuArrowRight className="h-[1.5rem] w-[1.5rem]" />
        </Link>
      )}
    </div>
  );
};

export default MySpaceEmptyState;
