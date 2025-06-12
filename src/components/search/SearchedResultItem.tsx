import { SearchedType } from "@/types/searchType";
import { RootState } from "@/stores/store";
import { useSelector } from "react-redux";
import Link from "next/link";
import { FaRegCalendarAlt } from "react-icons/fa";

const SearchedResultItem = ({ ad }: { ad: SearchedType }) => {
  const { searchField } = useSelector((state: RootState) => state.search);
  const { range, keyword } = searchField;

  const shouldHighlight = range === "ad_title" && keyword.trim().length > 0;

  const renderTitle = () => {
    if (!shouldHighlight) {
      return <>{ad.adTitle}</>;
    }

    const escaped = keyword.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
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
    <div className="flex flex-col justify-between border-b-[0.1rem] border-gray-medium px-[2rem] py-[1rem]">
      <div className="text-lg">
        <Link href={`/ad/${ad.id}`}>{renderTitle()}</Link>
      </div>
      <div className="flex flex-row justify-between">
        <div className="flex items-end">{ad.organizer.nickname}</div>
        <div className="flex flex-col items-end text-[#006B8B]">
          <div>{ad.adEndedAt} 까지 모집</div>
          <div className="flex flex-row items-center gap-[0.5rem]">
            <FaRegCalendarAlt />
            {ad.startedAt} ~ {ad.endedAt}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchedResultItem;
