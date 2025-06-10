import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/common/Header";
import NavigationBar from "@/components/common/NavigationBar";
import ReduxProvider from "@/stores/ReduxProvider";
import QueryProvider from "./(providers)/_providers/QueryProvider";
import ModalContainer from "@/components/modals/ModalContainer";

export const metadata: Metadata = {
  title: "Placeholder",
  description: "지도를 이용한 모임 웹 사이트",
  icons: {
    icon: "/favicon.png",
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
            <main className="pt-[6rem] md:pt-[7.5rem]">{children}</main>
            <ModalContainer />
            <NavigationBar />
          </QueryProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
