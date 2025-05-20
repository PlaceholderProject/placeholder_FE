import { SearchedType } from "@/types/searchType";
import { RootState } from "@/stores/store";
import { useSelector } from "react-redux";
import Link from "next/link";
import calculateDays from "@/utils/calculateDays";

const SearchedResultItem = ({ ad }: { ad: SearchedType }) => {
  const { searchField } = useSelector((state: RootState) => state.search);
  const { range, keyword } = searchField;

  const shouldHighlight = range === "ad_title" && keyword.trim().length > 0;

  const renderTitle = () => {
    if (!shouldHighlight) {
      return <>{ad.adTitle}</>;
    }

    const escaped = keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    const regex = new RegExp(`(${escaped})`, "gi");
    return ad.adTitle.split(regex).map((part, idx) => {
      return regex.test(part) ? (
        <span key={idx} className="font-bold">
          {part}
        </span>
      ) : (
        <span key={idx}>{part}</span>
      );
    });
  };

  return (
    <div className="flex flex-row justify-between border-b-[1px] border-[#CFCFCF]">
      <div>
        <Link href={`/ad/${ad.id}`}>{renderTitle()}</Link>
        <div>{ad.organizer.nickname}</div>
      </div>
      <div className="flex flex-col items-end">
        <div>{ad.adEndedAt} 까지 모집</div>
        <div>
          모임 날짜 : {ad.startedAt}~{ad.endedAt}{" "}
          <span>
            {ad.startedAt && ad.endedAt
              ? calculateDays({
                  startedAt: ad.startedAt,
                  endedAt: ad.endedAt,
                })
              : ""}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SearchedResultItem;
