import { NextRequest, NextResponse } from "next/server";
import { getMeetupByIdApi } from "./services/meetup.service";
import { BASE_URL } from "./constants/baseURL";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;

  // 비로그인 : 로그인, 회원가입 페이지 접근 허용
  if (!accessToken && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.next();
  }

  // 로그인 : 로그인, 회원가입 페이지 접근 차단
  if (accessToken && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 비로그인 : 인증 필요한 페이지 접근 시 로그인 페이지로 리다이렉트
  const protectedPaths = ["/account", "/meetup", "/my-space", "/notification"];
  const isProtected = protectedPaths.some(path => path === pathname || pathname.startsWith(`${path}/`));

  if (!accessToken && isProtected) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // meetup/edit : 방장 외 접근 막고 ad/{meetupId}로 리다이렉트
  if (pathname.startsWith("/meetup/edit")) {
    const meetupId = parseInt(pathname.split("/").pop() || "0", 10);

    if (isNaN(meetupId) || meetupId <= 0) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    try {
      const userResponse = await fetch(`${BASE_URL}/api/v1/user/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!userResponse.ok) {
        return NextResponse.redirect(new URL("/login", request.url));
      }

      const user = await userResponse.json();
      const meetup = await getMeetupByIdApi(meetupId);

      // 방장이 아니면 조회 페이지로
      if (user?.nickname !== meetup.organizer.nickname) {
        return NextResponse.redirect(new URL(`/ad/${meetupId}`, request.url));
      }
    } catch (error) {
      // 권한 확인 실패 시 통과시키지 않고 안전하게 조회 페이지로 (fail-closed)
      console.error("권한 체크 실패:", error);
      return NextResponse.redirect(new URL(`/ad/${meetupId}`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/signup", "/account", "/account/:path*", "/meetup/:path*", "/my-space/:path*", "/notification"],
};
