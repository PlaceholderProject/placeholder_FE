import { SearchedType } from "@/types/searchType";
import { RootState } from "@/stores/store";
import { useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaRegCalendarAlt, FaLock, FaCrown, FaMapMarkerAlt, FaRegCommentDots } from "react-icons/fa";
import { getImageURL } from "@/utils/getImageURL";
import LikeContainer from "../likes/LikeContainer";
import { getDday } from "@/utils/getDday";

type SearchResultDisplayType = SearchedType & {
  description?: string;
  name?: string;
  organizer: SearchedType["organizer"] & { image?: string };
};

const SearchedResultItem = ({ ad }: { ad: SearchedType }) => {
  const { searchField } = useSelector((state: RootState) => state.search);
  const { range, keyword } = searchField;
  const displayAd = ad as SearchResultDisplayType;
  const organizerImage = displayAd.organizer.profileImage ?? displayAd.organizer.image ?? null;
  const descriptionText = displayAd.meetup || displayAd.description || displayAd.name || "";
  const [profileImageSource, setProfileImageSource] = useState(getImageURL(organizerImage));

  const shouldHighlight = range === "ad_title" && keyword.trim().length > 0;
  const shouldHighlight2 = range === "organizer" && keyword.trim().length > 0;
  const shouldHighlightDescription = range === "description" && keyword.trim().length > 0;
  const canOpen = ad.isPublic || ad.isOrganizer;
  const adDday = ad.adEndedAt ? getDday(ad.adEndedAt) : null;
  const isUrgent = adDday === "D-DAY" || /^D-[0-3]$/.test(adDday ?? "");

  useEffect(() => {
    setProfileImageSource(getImageURL(organizerImage));
  }, [organizerImage]);

  // 검색어 하이라이팅 (검색 고유 기능 - 보존)
  const highlightText = (text: string) => {
    const trimmedKeyword = keyword.trim();
    if (trimmedKeyword.length === 0) return text;

    const escaped = trimmedKeyword.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    const regex = new RegExp(`(${escaped})`, "gi");
    return text.split(regex).map((part, idx) =>
      part.toLowerCase() === trimmedKeyword.toLowerCase() ? (
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
  const renderDescription = () => (shouldHighlightDescription ? highlightText(descriptionText) : <>{descriptionText}</>);

  return (
    <article className="group bg-card border-border hover:border-primary/30 flex min-h-[9rem] overflow-hidden rounded-[1.2rem] border p-[0.7rem] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-22px_rgba(22,21,15,0.45)]">
      <div className="bg-muted relative h-[7.4rem] w-[7.4rem] shrink-0 overflow-hidden rounded-[0.9rem]">
        {canOpen && ad.image ? (
          <Link href={`/ad/${ad.id}`} className="block h-full w-full">
            <Image unoptimized={false} src={getImageURL(ad.image)} alt={ad.adTitle} fill sizes="7.4rem" className="object-cover transition-transform duration-500 group-hover:scale-105" />
          </Link>
        ) : (
          <div className="bg-muted flex h-full w-full flex-col items-center justify-center gap-[0.4rem]">
            <span className="bg-card text-muted-foreground grid h-[2.8rem] w-[2.8rem] place-items-center rounded-full shadow-sm">
              <FaLock className="h-[1.2rem] w-[1.2rem]" />
            </span>
          </div>
        )}

        {adDday && (
          <span
            className={`absolute top-[0.5rem] right-[0.5rem] z-10 rounded-full px-[0.5rem] py-[0.15rem] font-mono text-[0.95rem] font-semibold backdrop-blur ${isUrgent ? "bg-destructive text-destructive-foreground" : "bg-background/90 text-foreground"}`}
          >
            {adDday}
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-[0.4rem] px-[0.8rem] py-[0.1rem]">
        <div className="space-y-[0.25rem]">
          <div className="flex min-w-0 items-center gap-[0.35rem]">
            {ad.isOrganizer && (
              <span className="bg-primary text-primary-foreground inline-flex h-[1.7rem] w-[1.7rem] shrink-0 place-content-center items-center rounded-full text-[0.95rem] shadow-sm">
                <FaCrown />
              </span>
            )}
            {!ad.isPublic && (
              <span className="bg-foreground/80 text-background inline-flex shrink-0 items-center gap-[0.3rem] rounded-full px-[0.55rem] py-[0.15rem] text-[0.95rem] font-semibold">
                <FaLock className="shrink-0" />
                비공개
              </span>
            )}
            {ad.place && (
              <span className="text-primary inline-flex min-w-0 items-center gap-[0.3rem] text-xs font-semibold">
                <FaMapMarkerAlt className="shrink-0" />
                <span className="truncate">{ad.place}</span>
              </span>
            )}
          </div>

          <h3 className="line-clamp-2 text-sm leading-snug font-semibold break-words">
            {canOpen ? (
              <Link href={`/ad/${ad.id}`} className="hover:text-primary transition-colors">
                {renderTitle()}
              </Link>
            ) : (
              renderTitle()
            )}
          </h3>

          {descriptionText && <p className="text-muted-foreground line-clamp-1 text-xs leading-relaxed break-keep">{renderDescription()}</p>}
          <div className="text-muted-foreground flex min-w-0 items-center gap-[0.35rem] text-[1.05rem]">
            <FaRegCalendarAlt className="shrink-0" />
            <span className="truncate">
              {ad.startedAt ?? "미정"} ~ {ad.endedAt ?? "미정"}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-[0.8rem]">
          <div className="flex min-w-0 items-center gap-[0.4rem]">
            <div className="relative h-[1.8rem] w-[1.8rem] flex-shrink-0">
              <Image unoptimized={false} src={profileImageSource} fill alt="작성자 프로필 이미지" className="rounded-full object-cover" onError={() => setProfileImageSource("/profile.png")} />
            </div>
            <div className="text-muted-foreground truncate text-xs">{renderOrganizer()}</div>
          </div>

          <div className="pointer-events-auto flex flex-shrink-0 items-center gap-[0.7rem]">
            <span className="text-muted-foreground inline-flex items-center gap-[0.3rem] text-xs">
              <FaRegCommentDots className="h-[1.2rem] w-[1.2rem]" />
              {ad.commentCount}
            </span>
            <LikeContainer id={ad.id} initialIsLike={ad.isLike} initialLikeCount={ad.likeCount} />
          </div>
        </div>
      </div>
    </article>
  );
};

export default SearchedResultItem;
