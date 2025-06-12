import { NextRequest, NextResponse } from "next/server";
import { getMeetupByIdApi } from "./services/meetup.service";
import { BASE_URL } from "./constants/baseURL";

// 아래 내용 추가 때문에 async로 바꿨어요!
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log("====미들웨어 실행됨====", pathname);

  const accessToken = request.cookies.get("accessToken")?.value;

  if (!accessToken) {
    console.log("로그인 안 된 사용자입니다.");
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // meetup-edit 방장 외 접근 막고 ad/MeetupId로 리다이렉트하기
  if (pathname.startsWith("/meetup-edit")) {
    console.log(">>> meetup-edit 경로 감지:", pathname);
    try {
      // 경로에서 meetupId 추출
      console.log(">>>>>권한 체크 시작");
      const meetupId = parseInt(pathname.split("/").pop() || "0", 10);
      console.log("경로 추출 meetupId:", meetupId);

      if (isNaN(meetupId) || meetupId <= 0) {
        console.log("유효하지 안흔 meetupID");
        return NextResponse.redirect(new URL("/", request.url));
      }

      //현재 사용자, 모임 방장 ㅏㄱ져오기
      const userResponse = await fetch(`${BASE_URL}/api/v1/user/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!userResponse.ok) {
        console.log("사용자 정보 가져오기 실패", userResponse.status);
        return NextResponse.redirect(new URL("/login", request.url));
      }

      const user = await userResponse.json();
      console.log("현재 유저:", user);

      const meetup = await getMeetupByIdApi(meetupId);
      console.log("모임 정보 여기 가져왓어:", meetup);
      console.log("방장 닉네임:", meetup.organizer.nickname);

      // 권한 확인
      if (user?.nickname !== meetup.organizer.nickname) {
        console.log("모임의 방장만 접근할 수 있습니다.");
        const adUrl = new URL(`/ad/${meetupId}`, request.url);
        return NextResponse.redirect(adUrl);
      } else {
        console.log("권한 있음 통과");
      }
    } catch (error) {
      console.error(">>>>>>> 권한체크 로직 에러:", error);
      // return NextResponse.redirect(new URL("/", request.url));
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account", "/account-delete", "/account-edit", "/password-edit", "/meetup/:path*", "/meetup-create", "/meetup-edit", "/meetup-edit/:path*", "/my-space/:path*", "/notification"],
};
