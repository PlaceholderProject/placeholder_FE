import Link from "next/link";
import { LuArrowRight, LuCircleAlert, LuMapPinOff } from "react-icons/lu";

interface ResourceStateProps {
  kind?: "not-found" | "error";
  title: string;
  description: string;
  actionHref: string;
  actionLabel: string;
}

const ResourceState = ({ kind = "not-found", title, description, actionHref, actionLabel }: ResourceStateProps) => {
  const Icon = kind === "not-found" ? LuMapPinOff : LuCircleAlert;

  return (
    <div className="mx-auto flex min-h-[38rem] w-[calc(100%-3.2rem)] max-w-[64rem] items-center justify-center py-[4rem]">
      <section className="border-border bg-card w-full rounded-[2.4rem] border px-[2rem] py-[4rem] text-center">
        <span className="bg-primary-soft text-primary mx-auto grid h-[5.6rem] w-[5.6rem] place-items-center rounded-[1.8rem]">
          <Icon className="h-[2.6rem] w-[2.6rem] stroke-[1.8]" />
        </span>
        <h1 className="text-foreground mt-[1.4rem] text-[2.2rem] font-black tracking-[-0.035em]">{title}</h1>
        <p className="text-muted-foreground mx-auto mt-[0.7rem] max-w-[36rem] text-sm leading-relaxed break-keep">{description}</p>
        <Link
          href={actionHref}
          className="bg-primary text-primary-foreground hover:bg-primary-hover mt-[1.7rem] inline-flex h-[4.2rem] items-center gap-[0.55rem] rounded-full px-[1.5rem] text-sm font-bold transition-colors"
        >
          {actionLabel}
          <LuArrowRight className="h-[1.5rem] w-[1.5rem]" />
        </Link>
      </section>
    </div>
  );
};

export default ResourceState;
