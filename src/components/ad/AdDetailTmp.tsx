"use client";

import React, { useEffect, useState } from "react";
import calculateDays from "@/utils/calculateDays";
import AdNonModal from "./AdNonModal";
import { BASE_URL } from "@/constants/baseURL";
import { useAdItem } from "@/hooks/useAdItem";
import Image from "next/image";

// 1. 컴포넌트 마운트
// 2. isAuthorized는 초기값인 false
// 3. adData가 로딩중이므로 if (!adData) return null 조건 떄문에 아무것도 안 뜨는 것처럼 보임
// => adData가 null일때 왜 콘솔에 안 뜨냐? if 절 return null 때문에 함수 일찍 종료되므로 콘ㅇ솔 출력X
// (로그에 보이는 콘솔 춫력은 다 adData가 로드된 후 렌더링에서 발생한 것)
// 근데 사실 이것이 첫번째 렌더링임

// 4. adData 로드되면 컴포넌트 리렌더링 (두번째 렌더링)
// 5. 이 시점에 organizerNickname = adData?.organizer.nicknmme 설정됨

const AdDetailTmp = ({ meetupId, userNickname }: { meetupId: number; userNickname: string }) => {
  const { adData, error, isPending } = useAdItem(meetupId);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const organizerNickname = adData?.organizer.nickname;

  // 7? 8? 렌더링 후 useEffect 실행
  // organizdrNickname과 유저닉ㄴ엠 비교
  // 트루 폴스에 따라 setIsAuthorized 호출 및 다르게 설정
  useEffect(() => {
    if (organizerNickname === userNickname) {
      setIsAuthorized(true);
      // 9. 이 경우 isAuthorized 자체는 true여도 콘솔 출력은 false로 뜨는데
      // setIsAuthorized(true) 호출이 됐지만 상태 업데이트는 비동기적으로 이루어지기 때문
      console.log(`유즈 이펙트 안 트루냐? ${isAuthorized}`);

      //10. 세번째 렌더링
      // setIsAuthorized(true)에 의해 상태 업뎃되면 또 리렌더링 되겠지
      // 이때 애드데이터? 유즈 이펙트 외부 트루냐? (true) cnffur
      // 이때 isAuthorized 상태가 true로 비동기적 업데이트 된 것.
    } else {
      setIsAuthorized(false);
    }
  }, [adData, userNickname]);

  if (error) return <div>에러 발생: {error.message}</div>;
  if (isPending) return <div>로딩중...</div>;
  if (!adData) return null;

  const startedAt = adData.startedAt;
  const endedAt = adData.endedAt;

  const imageUrl = `${BASE_URL}/${adData.image}`;

  // 6. 콘솔에 애드데이터? 출력
  console.log("애드데이터?", adData);
  // 7. 유즈이펙트 외부 트루니? 출력 => false
  console.log(`유즈 이펙트 외부 트루냐? ${isAuthorized}`);

  // ✅ a. 컴포넌트 마운트 (adData 로딩중) => 첫ㅂ건째 렌더링 (return null)
  // b. adData 로딩 완료 후 렌더링 => 두번쨰렌더링
  // c. 렌더링 완료후 useEffect 실행
  // useEffect 내에서 비교 후 setIsAuthorized(true) 호출
  // useEffect 내에서 "유즈 이펙트 안 트루냐? false" 출력 (이 시점에서는 아직 isAuthorized가 업데이트되지 않음)

  // c. isAuthorized 상태 업데이트 후 다시 렌더링

  // 컴포넌트 렌더링 중 "애드데이터?", "유즈 이펙트 외부 트루냐? true" 출력 (이제 isAuthorized는 true)

  // 이런 동작이 발생하는 이유는 React의 상태 업데이트가 비동기적으로 이루어지기 때문이다.
  // setIsAuthorized(true)를 호출해도 즉시 isAuthorized 값이 업데이트되지 않고, 다음 렌더링 사이클에서 업데이트!
  // 그리고 useEffect 내부에서 현재 렌더링 주기의 isAuthorized 값을 참조하면 이전 값이 출력됩.
  // 따라서 "유즈 이펙트 안 트루냐? false"에서는 여전히 false가 출력되는 것.

  return (
    <>
      <div>
        <div>⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯</div>
        {/* <Image width={50} height={20} src={imageUrl} alt={"모임 광고글 이미지"} /> */}
        <Image src={imageUrl} alt="모임 광고글 이미지" width={150} height={100} />

        <div>⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯</div>
        <div>🩵 모임이름 : {adData.name}</div>

        <div>방장이름:{adData.organizer.nickname}</div>
        {isAuthorized && <AdNonModal meetupId={meetupId} />}
        <div>
          🍎 모임장소 : [{adData.place}] {adData.placeDescription}
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
        </div>

        <div>{adData.description}</div>
      </div>
    </>
  );
};

export default AdDetailTmp;
