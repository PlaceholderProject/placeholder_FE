import { NextRequest, NextResponse } from "next/server";
import { getMeetupByIdApi } from "./services/meetup.service";
import { BASE_URL } from "./constants/baseURL";
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  if (!accessToken && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.next();
  }
  if (accessToken && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  const protectedPaths = ["/account", "/account/delete", "/account/edit", "/account/password-edit", "/meetup", "/meetup/create", "/meetup/edit", "/my-space", "/notification"];
  const isProtected = protectedPaths.some(path => path === pathname || pathname.startsWith(`${path}/`));

  if (!accessToken && isProtected) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (pathname.startsWith("/meetup/edit")) {
    try {
      const meetupId = parseInt(pathname.split("/").pop() || "0", 10);
      if (isNaN(meetupId) || meetupId <= 0) {
        return NextResponse.redirect(new URL("/", request.url));
      }
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
      if (user?.nickname !== meetup.organizer.nickname) {
        const adUrl = new URL(`/ad/${meetupId}`, request.url);
        return NextResponse.redirect(adUrl);
      } else {
      }
    } catch (error) {
      console.error(">>>>>>> 권한체크 로직 에러:", error);
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/signup",
    "/account",
    "/account/:path*",
    "/meetup/:path*",
    "/my-space/:path*",
    "/notification",
  ],
};
