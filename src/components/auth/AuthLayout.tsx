import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import BrandLogo from "@/components/common/BrandLogo";

interface AuthLayoutProps {
  mode: "login" | "signup";
  children: ReactNode;
}

const AUTH_CONTENT = {
  login: {
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1000&h=1400&fit=crop&auto=format",
    alt: "함께하는 사람들",
    headline: "모두의 모임,\n여기서 시작해요.",
    description: "관심사로 만나고, 함께 일정을 만들고, 새로운 사람들과 연결되세요.",
  },
  signup: {
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1000&h=1400&fit=crop&auto=format",
    alt: "함께하는 사람들",
    headline: "모두의 모임,\n여기서 시작해요.",
    description: "관심사로 만나고, 함께 일정을 만들고, 새로운 사람들과 연결되세요.",
  },
};

const AuthLayout = ({ mode, children }: AuthLayoutProps) => {
  const content = AUTH_CONTENT[mode];

  return (
    <div className="bg-background grid min-h-screen lg:grid-cols-2">
      <section className="bg-foreground relative hidden overflow-hidden lg:block">
        <Image src={content.image} alt={content.alt} fill priority unoptimized sizes="50vw" className="object-cover opacity-55" />
        <div className="from-foreground via-foreground/45 absolute inset-0 bg-gradient-to-t to-transparent" />
        <div className="text-background relative flex h-full flex-col justify-between p-[4.4rem] lg:p-[4.8rem]">
          <Link href="/" aria-label="Placeholder 홈으로 이동" className="inline-flex">
            <BrandLogo inverse className="h-[3rem] w-[13.3rem]" />
          </Link>

          <div className="max-w-[36rem] pb-[1rem]">
            <h2 className="text-4xl leading-tight font-bold whitespace-pre-line">{content.headline}</h2>
            <p className="text-background/75 mt-[1.2rem] text-base leading-relaxed break-keep">{content.description}</p>
          </div>
        </div>
      </section>

      <section className="flex min-h-full items-center justify-center px-[2rem] py-[4rem] lg:px-[4.8rem]">
        <div className="w-full max-w-[38rem]">
          <Link href="/" aria-label="Placeholder 홈으로 이동" className="mb-[2.4rem] inline-flex lg:hidden">
            <BrandLogo className="h-[2.8rem] w-[12.5rem]" />
          </Link>
          {children}
        </div>
      </section>
    </div>
  );
};

export default AuthLayout;
