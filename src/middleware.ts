import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log("미들웨어 실행됨");

  const accessToken = request.cookies.get("accessToken")?.value;

  if (!accessToken) {
    console.log("로그인 안 된 사용자입니다.");
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account", "/account-delete", "/account-edit", "/password-edit", "/meetup/:path*", "/meetup-create", "/meetup-edit", "/meetup-edit/:path*", "/my-space/:path*", "/notification"],
};
