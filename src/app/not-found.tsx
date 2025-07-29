import Link from "next/link";
import { FaHome } from "react-icons/fa";

export default function NotFound() {
  return (
    <div
      className="relative flex min-h-[calc(100vh-12rem)] flex-col items-center justify-center bg-[#f9f9f9] p-4 text-center md:min-h-[calc(100vh-13.5rem)] overflow-hidden">
      <div
        className="pointer-events-none absolute select-none text-[30vw] lg:text-[20vw] font-extrabold text-gray-300 opacity-20">
        404
      </div>


      <div className="relative z-10 max-w-md">
        <img
          src="/smallLogoAlt.svg"
          alt="Logo"
          className="mx-auto mb-6 w-56 h-56"
        />

        <p className="mt-2 text-base text-gray-500">
          죄송합니다. 요청하신 페이지를 찾을 수 없습니다.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-opacity-85"
        >
          <FaHome />
          <span>메인으로 돌아가기</span>
        </Link>
      </div>
    </div>
  );
}
