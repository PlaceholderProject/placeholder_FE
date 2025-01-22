"use client";

import { BASE_URL } from "@/constants/baseURL";
import calculateDays from "@/utils/calculateDays";
import AdNonModal from "./AdNonModal";
import Cookies from "js-cookie";

const AdDetail = async ({ meetupId }: { meetupId: number }) => {
  const token = Cookies.get("accessToken");

  try {
    const response = await fetch(`${BASE_URL}/api/v1/meetup/${meetupId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("해당 id 모임 가져오기 실패");
    }

    const meetupAsAd = await response.json();
    const startedAt = meetupAsAd.startedAt;
    const endedAt = meetupAsAd.endedAt;
    console.log(meetupAsAd);
    const imageUrl = `${BASE_URL}${meetupAsAd.image}`;

    return (
      <>
        <div>
          <div>⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯</div>
          {/* <Image width={50} height={20} src={imageUrl} alt={"모임 광고글 이미지"} /> */}
          <img src={imageUrl} alt={"모임 광고글 이미지"} />

          <div>⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯</div>
          <div>🩵 모임이름 : {meetupAsAd.name}</div>

          <AdNonModal meetupId={meetupId} />
          <div>
            🍎 모임장소 : [{meetupAsAd.place}] {meetupAsAd.placeDescription}
          </div>
          <div>
            모임날짜 : {startedAt === null ? "미정" : startedAt.substring(0, 10)} ~ {endedAt === null ? "미정" : endedAt.substring(0, 10)}
            <div>
              {startedAt && endedAt
                ? calculateDays({
                    startedAt: startedAt,
                    endedAt: endedAt,
                  })
                : ""}
            </div>
            <br />
            🐥🐥🐥🐥 날짜 계산 함수가 실행이 된다는 것 자체가 미정이 하나도 없단 뜻이고 day냐 days냐는 함수자체에서 판단해주면 된다고 생각해,, 맞지..?🐥🐥
          </div>
          {/* ---------TODO-------- <br />
            두번재 날짜에서 첫번째 날짜 빼서 계산하고 값이 1이하면 day, 아니면 days 붙이는 함수 util로 만들기 미정이 있으면 day글자 자체가 안 나오게 (메인페이지에서도 사용)
            <div>
  {meetupAsAd.startedAt} ~ {meetupAsAd.endedAt} {
    (() => {
      const days = calculateDays({
        startedAt: meetupAsAd.startedAt,
        endedAt: meetupAsAd.endedAt
      });
      return days > 0 ? `${days} ${days === 1 ? 'day' : 'days'}` : '';
    })()
  }
</div>

여기에 null일 경우도 포함해서 분기해서 함수 로직 만들기 */}
          {/* 미정이 하나라도 있을 경우 계산할 필요도 없고 days 표기X
days가 0이면 day => 계산 상 numberOfDays는 1일로 나올 듯
days가 1이상이면 days

이 함수는 최소 AdPage와 MainPage, 두 군데 이상에서 사용됨!
숫자 표기와 days 표기를 calculateDays 함수 내에서 한번에 리턴할지
아니면 따로 할지 */}
          <div>{meetupAsAd.description}</div>
        </div>
      </>
    );
  } catch (error) {
    return <div>에러 발생: {error.message}</div>;
  }
};

export default AdDetail;
