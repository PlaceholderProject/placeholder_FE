import Image from "next/image";
import Link from "next/link";
import { FaHome } from "react-icons/fa";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-12rem)] flex-col items-center justify-center bg-[#f9f9f9] p-4 text-center md:min-h-[calc(100vh-13.5rem)]">
      <div className="max-w-md">
        <Image src="/favicon.png" alt="Placeholder Icon" width={80} height={80} className="mx-auto mb-6" />

        <h1 className="text-6xl md:text-8xl font-bold text-gray-800">404</h1>
        <p className="mt-4 text-xl font-semibold text-gray-700 md:text-2xl">Page Not Found</p>
        <p className="mt-2 text-base text-gray-500">죄송합니다. 요청하신 페이지를 찾을 수 없습니다.</p>

        <Link href="/" className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-opacity-85">
          <FaHome />
          <span>메인으로 돌아가기</span>
        </Link>
      </div>
    </div>
  );
}
