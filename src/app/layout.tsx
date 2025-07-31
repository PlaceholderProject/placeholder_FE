// import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/common/Header";
import NavigationBar from "@/components/common/NavigationBar";
import ReduxProvider from "@/stores/ReduxProvider";
import QueryProvider from "./(providers)/_providers/QueryProvider";
import ModalContainer from "@/components/modals/ModalContainer";
import { Toaster } from "sonner";

// export const metadata: Metadata = {
//   title: "Placeholder - 모두의 모임 플랫폼",
//   description: "당신만의 모임을 만들고, 함께할 사람을 찾아보세요.",
//   keywords: "모임, 만남, 동호회, 프론트엔드 프로젝트, 커뮤니티",
//   authors: [{ name: "Team Placeholder" }],
//   icons: {
//     icon: "/favicon.png",
//   },
// };

// "redirects": [
//   {
//     "source": "/sitemap.xml",
//     "destination": "https://static.place-holder.site/sitemap.xml",
//     "permanent": true
//   }
// ]

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
    <html className={`${pretendard.variable}`}>
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
