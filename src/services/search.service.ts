import { BASE_URL } from "@/constants/baseURL";

// 메인 페이지, 검색결과 페이지 : 검색어 제출
export const getSearchedAd = async (range: string, keyword: string) => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/meetup?${range}=${keyword}`, {
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

    const { result } = await response.json();
    console.log(result);

    return result;
  } catch (error) {
    console.log(error);
    alert("신청서를 보내는 도중 오류가 발생했습니다. 다시 시도해주세요.");
    return;
  }
};
