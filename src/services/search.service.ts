import { BASE_URL } from "@/constants/baseURL";

// 메인 페이지, 검색결과 페이지 : 검색어 제출
export const getSearchedAd = async (range: string, keyword: string, page: number) => {
  const size = 10;
  try {
    const response = await fetch(`${BASE_URL}/api/v1/meetup?${range}=${keyword}&page=${page}&size=${size}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.headers.get("Content-Type")?.includes("application/json")) {
        const errorResult = await response.json();
        alert(errorResult.message);
      } else {
        const errorText = await response.text();
        alert(errorText);
      }
      return;
    }

    const data = await response.json();

    return {
      proposals: data.result,
      total: data.total,
    };
  } catch (error) {
    console.log(error);
    alert("신청서를 보내는 도중 오류가 발생했습니다. 다시 시도해주세요.");
    return;
  }
};
