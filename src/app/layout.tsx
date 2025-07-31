import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/common/Header";
import NavigationBar from "@/components/common/NavigationBar";
import ReduxProvider from "@/stores/ReduxProvider";
import QueryProvider from "./(providers)/_providers/QueryProvider";
import ModalContainer from "@/components/modals/ModalContainer";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Placeholder - 모두의 모임 플랫폼",
  description: "당신만의 모임을 만들고, 함께할 사람을 찾아보세요.",
  keywords: "모임, 만남, 동호회, 프론트엔드 프로젝트, 커뮤니티",
  authors: [{ name: "Team Placeholder" }],
  icons: {
    icon: "/favicon.png",
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL("https://place-holder.site"),
  openGraph: {
    title: "Placeholder - 모두의 모임 플랫폼",
    description: "당신만의 모임을 만들고, 함께할 사람을 찾아보세요.",
    url: "https://place-holder.site",
    siteName: "Placeholder",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Placeholder 이미지",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Placeholder - 모두의 모임 플랫폼",
    description: "당신만의 모임을 만들고, 함께할 사람을 찾아보세요.",
    images: ["/logo.png"],
  },
};

const pretendard = localFont({
  src: "../fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "100 900",
  variable: "--font-pretendard",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${pretendard.variable}`}>
      <body className={pretendard.className}>
        <ReduxProvider>
          <QueryProvider>
            <Header />
            <main className="pb-[6rem] pt-[6rem] md:pb-[0rem] md:pt-[7.5rem]">{children}</main>
            <ModalContainer />
            <NavigationBar />
            <Toaster position="top-center" />
          </QueryProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
