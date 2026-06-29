import { SearchedType } from "@/types/searchType";
import { RootState } from "@/stores/store";
import { useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { FaRegCalendarAlt, FaLock, FaCrown } from "react-icons/fa";
import { getImageURL } from "@/utils/getImageURL";
import LikeContainer from "../likes/LikeContainer";

const SearchedResultItem = ({ ad }: { ad: SearchedType }) => {
  const { searchField } = useSelector((state: RootState) => state.search);
  const { range, keyword } = searchField;

  const shouldHighlight = range === "ad_title" && keyword.trim().length > 0;
  const shouldHighlight2 = range === "organizer" && keyword.trim().length > 0;

  // 검색어 하이라이팅 (검색 고유 기능 - 보존)
  const highlightText = (text: string) => {
    const escaped = keyword.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    const regex = new RegExp(`(${escaped})`, "gi");
    return text.split(regex).map((part, idx) =>
      regex.test(part) ? (
        <mark key={idx} className="bg-accent/60 rounded-[0.2rem] font-bold text-inherit">
          {part}
        </mark>
      ) : (
        <span key={idx}>{part}</span>
      ),
    );
  };

  const renderTitle = () => (shouldHighlight ? highlightText(ad.adTitle) : <>{ad.adTitle}</>);
  const renderOrganizer = () => (shouldHighlight2 ? highlightText(ad.organizer.nickname) : <>{ad.organizer.nickname}</>);

  return (
    <article className="group bg-card border-border hover:border-primary/30 flex flex-col overflow-hidden rounded-[1.6rem] border transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_18px_40px_-20px_rgba(22,21,15,0.35)]">
      {/* 이미지 영역 */}
      <div className="bg-muted relative aspect-square w-full overflow-hidden">
        {ad.isPublic && ad.image ? (
          <Link href={`/ad/${ad.id}`} className="block h-full w-full">
            <Image
              unoptimized={false}
              src={getImageURL(ad.image)}
              alt="검색 결과 이미지"
              fill
              sizes="(max-width: 768px) 50vw, 200px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </Link>
        ) : (
          <div className="bg-muted flex h-full w-full items-center justify-center">
            <FaLock className="text-muted-foreground h-[4rem] w-[4rem]" />
          </div>
        )}
        {ad.isOrganizer && (
          <div className="bg-primary text-primary-foreground absolute top-3 left-3 z-10 flex h-[2.2rem] w-[2.2rem] place-content-center items-center rounded-full text-[1.4rem] shadow-sm">
            <FaCrown />
          </div>
        )}
        {ad.adEndedAt && (
          <span className="bg-background/90 text-foreground absolute top-3 right-3 z-10 rounded-full px-[0.7rem] py-[0.2rem] text-xs font-medium backdrop-blur">~{ad.adEndedAt.substring(5, 10)}</span>
        )}
      </div>

      {/* 콘텐츠 영역 */}
      <div className="flex flex-1 flex-col gap-[0.6rem] p-[1.1rem]">
        <h3 className="line-clamp-2 text-sm leading-snug font-semibold break-words">
          <span className="text-primary whitespace-nowrap">[{ad.place}]</span>{" "}
          <Link href={`/ad/${ad.id}`} className="hover:underline">
            {renderTitle()}
          </Link>
        </h3>

        <div className="text-muted-foreground flex items-center gap-[0.4rem] text-xs">
          <FaRegCalendarAlt className="shrink-0" />
          <span className="truncate">
            {ad.startedAt ?? "미정"} ~ {ad.endedAt ?? "미정"}
          </span>
        </div>

        {/* 작성자 & 좋아요 */}
        <div className="border-border mt-auto flex items-center justify-between border-t pt-[0.7rem]">
          <div className="flex min-w-0 items-center gap-[0.4rem]">
            <div className="relative h-[2rem] w-[2rem] flex-shrink-0">
              <Image unoptimized={false} src={getImageURL(ad.organizer.profileImage)} fill alt="작성자 프로필 이미지" className="rounded-full object-cover" />
            </div>
            <div className="text-muted-foreground truncate text-sm">{renderOrganizer()}</div>
          </div>

          <div className="pointer-events-auto flex-shrink-0">
            <LikeContainer id={ad.id} initialIsLike={ad.isLike} initialLikeCount={ad.likeCount} />
          </div>
        </div>
      </div>
    </article>
  );
};

export default SearchedResultItem;
