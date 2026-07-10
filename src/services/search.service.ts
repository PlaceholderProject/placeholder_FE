import { BASE_URL } from "@/constants/baseURL";
import { TypePurposeType } from "@/types/meetupType";
import { toast } from "sonner";

// 메인 페이지, 검색결과 페이지 : 검색어 제출
export const getSearchedAd = async (range: string, keyword: string, page: number, category?: TypePurposeType) => {
  const size = 10;
  const queryParams = new URLSearchParams();
  queryParams.set(range, keyword);
  queryParams.set("page", String(page));
  queryParams.set("size", String(size));
  if (category) queryParams.set("category", category);

  try {
    const response = await fetch(`${BASE_URL}/api/v1/meetup?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.headers.get("Content-Type")?.includes("application/json")) {
        const errorResult = await response.json();
        toast.error(errorResult.message);
      } else {
        const errorText = await response.text();
        toast.error(errorText);
      }
      return;
    }

    const data = await response.json();

    return {
      proposals: data.result,
      total: data.total ?? data.count ?? 0,
    };
  } catch {
    toast.error("검색하는 도중 오류가 발생했습니다. 다시 시도해주세요.");
    return;
  }
};
