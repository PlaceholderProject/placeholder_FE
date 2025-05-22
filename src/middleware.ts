import { NextRequest, NextResponse } from "next/server";
import { getUser } from "./services/user.service";
import { getMeetupByIdApi } from "./services/meetup.service";

// 아래 내용 추가 때문에 async로 바꿨어요!
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log("미들웨어 실행됨");

  const accessToken = request.cookies.get("accessToken")?.value;

  if (!accessToken) {
    console.log("로그인 안 된 사용자입니다.");
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // meetup-edit 방장 외 접근 막고 ad/MeetupId로 리다이렉트하기

  if (pathname.startsWith("/meetup-edit")) {
    try {
      // 경로에서 meetupId 추출
      const meetupId = parseInt(pathname.split("/").pop() || "0", 10);

      if (isNaN(meetupId) || meetupId <= 0) {
        console.log("유효하지 안흔 meetupID");
        return NextResponse.redirect(new URL("/", request.url));
      }

      //현재 사용자, 모임 방장 ㅏㄱ져오기

      const user = await getUser();
      const meetup = await getMeetupByIdApi(meetupId);

      // 권한 확인
      if (user?.nickname !== meetup.organizer.nickname) {
        console.log("모임의 방장만 접근할 수 있습니다.");
        const adUrl = new URL(`/ad/${meetupId}`, request.url);
        return NextResponse.redirect(adUrl);
      }
    } catch (error) {
      console.error("미들웨어 에러:", error);
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
  // const userNickname = getUser().nickname;
  // const organizerNickname = (meetupId: number) => getMeetupByIdApi(meetupId).organizer.nickname;
  // const isAuthorized = userNickname === organizerNickname;
  // if (accessToken && !isAuthorized) {
  //   console.log("모임의 방장만 접근할 수 있습니다.");

  //   const adUrl = new URL("/ad", meetupId);
  //   return NextResponse.redirect(adUrl);
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account", "/account-delete", "/account-edit", "/password-edit", "/meetup/:path*", "/meetup-create", "/meetup-edit", "/meetup-edit/:path*", "/my-space/:path*", "/notification"],
};
