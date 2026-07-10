"use client";

import { RootState } from "@/stores/store";
import { setSearchField } from "@/stores/searchSlice";
import { TypePurposeType } from "@/types/meetupType";
import SegmentedIndicator from "@/components/common/SegmentedIndicator";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { LuClock3, LuSearch, LuTrash2, LuX } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const RECENT_SEARCH_STORAGE_KEY = "placeholder_recent_searches";
const MAX_RECENT_SEARCHES = 4;

const CATEGORIES: Exclude<TypePurposeType, null>[] = ["운동", "공부", "취준", "취미", "친목", "맛집", "여행", "기타"];
const SEARCH_RANGES = [
  { value: "ad_title", label: "제목" },
  { value: "organizer", label: "작성자" },
  { value: "description", label: "내용" },
] as const;

const SearchForm = () => {
  const searchField = useSelector((state: RootState) => state.search.searchField);
  const [range, setRange] = useState(searchField.range || "ad_title");
  const [keyword, setKeyword] = useState(searchField.keyword);
  const [category, setCategory] = useState<TypePurposeType>(searchField.category ?? null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const storedSearches = window.localStorage.getItem(RECENT_SEARCH_STORAGE_KEY);
    if (!storedSearches) return;

    try {
      const parsedSearches = JSON.parse(storedSearches);
      if (Array.isArray(parsedSearches)) {
        setRecentSearches(parsedSearches.filter((item): item is string => typeof item === "string").slice(0, MAX_RECENT_SEARCHES));
      }
    } catch {
      window.localStorage.removeItem(RECENT_SEARCH_STORAGE_KEY);
    }
  }, []);

  const updateRecentSearches = (nextSearches: string[]) => {
    setRecentSearches(nextSearches);
    window.localStorage.setItem(RECENT_SEARCH_STORAGE_KEY, JSON.stringify(nextSearches));
  };

  const saveRecentSearch = (nextKeyword: string) => {
    const trimmedKeyword = nextKeyword.trim();
    if (!trimmedKeyword) return;

    setRecentSearches(previousSearches => {
      const nextSearches = [trimmedKeyword, ...previousSearches.filter(item => item !== trimmedKeyword)].slice(0, MAX_RECENT_SEARCHES);
      window.localStorage.setItem(RECENT_SEARCH_STORAGE_KEY, JSON.stringify(nextSearches));
      return nextSearches;
    });
  };

  const handleKeyword = (event: ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value);
  };

  const handleClearKeyword = () => {
    setKeyword("");
    dispatch(setSearchField({ keyword: "" }));
  };

  const handleRange = (nextRange: string) => {
    setRange(nextRange);
    dispatch(setSearchField({ range: nextRange }));
  };

  const handleRecentKeyword = (nextKeyword: string) => {
    setKeyword(nextKeyword);
    dispatch(setSearchField({ range, keyword: nextKeyword, category }));
    saveRecentSearch(nextKeyword);
  };

  const handleRemoveRecentKeyword = (targetKeyword: string) => {
    updateRecentSearches(recentSearches.filter(item => item !== targetKeyword));
  };

  const handleClearRecentSearches = () => {
    updateRecentSearches([]);
  };

  const handleCategory = (nextCategory: TypePurposeType) => {
    setCategory(nextCategory);
    dispatch(setSearchField({ category: nextCategory }));
  };

  const handleKeywordSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedKeyword = keyword.trim();

    if (!trimmedKeyword) {
      toast.error("검색어를 입력해주세요.");
      return;
    }

    setKeyword(trimmedKeyword);
    dispatch(setSearchField({ range, keyword: trimmedKeyword, category }));
    saveRecentSearch(trimmedKeyword);
  };

  return (
    <div className="mx-auto w-[calc(100%-3.2rem)] pt-[2.2rem] md:max-w-[112rem] md:pt-[3.6rem]">
      <header className="mb-[1.8rem] md:mb-[2.4rem]">
        <p className="text-primary mb-[0.5rem] text-xs font-black tracking-[0.08em]">모임 검색</p>
        <h1 className="text-foreground text-[2.4rem] leading-tight font-black tracking-[-0.035em] md:text-[3.2rem]">어떤 모임을 찾고 있나요?</h1>
        <p className="text-muted-foreground mt-[0.7rem] text-sm md:text-base">모임 이름부터 관심사, 작성자까지 원하는 방식으로 찾아보세요.</p>
      </header>

      <section className="border-border bg-card rounded-[2.2rem] border p-[1.4rem] shadow-[0_1.8rem_4rem_-3.2rem_rgba(24,23,29,0.3)] md:p-[2rem]">
        <form
          onSubmit={handleKeywordSubmit}
          role="search"
          className="border-border bg-background focus-within:border-primary/45 focus-within:ring-primary/10 flex min-h-[5.6rem] items-center gap-[1rem] rounded-[1.6rem] border px-[1.4rem] transition-all focus-within:ring-4 md:min-h-[6rem] md:px-[1.8rem]"
        >
          <LuSearch className="text-muted-foreground h-[2.1rem] w-[2.1rem] shrink-0 stroke-[2]" aria-hidden="true" />
          <input
            type="search"
            onChange={handleKeyword}
            value={keyword}
            aria-label="검색어"
            placeholder="모임, 관심사를 검색해보세요"
            className="placeholder:text-muted-foreground min-w-0 flex-1 [appearance:textfield] bg-transparent text-base font-medium focus:outline-none [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-cancel-button]:appearance-none"
          />
          {keyword && (
            <button
              type="button"
              onClick={handleClearKeyword}
              aria-label="검색어 지우기"
              className="bg-muted text-muted-foreground hover:text-foreground grid h-[3rem] w-[3rem] shrink-0 place-items-center rounded-full transition-colors"
            >
              <LuX className="h-[1.6rem] w-[1.6rem] stroke-[2.2]" />
            </button>
          )}
          <button
            type="submit"
            aria-label="검색"
            className="bg-primary text-primary-foreground hover:bg-primary-hover grid h-[4rem] w-[4rem] shrink-0 place-items-center rounded-[1.2rem] transition-colors md:flex md:w-auto md:gap-[0.6rem] md:px-[1.6rem] md:text-sm md:font-black"
          >
            <LuSearch className="h-[1.8rem] w-[1.8rem] stroke-[2.2]" />
            <span className="hidden md:inline">검색</span>
          </button>
        </form>

        <div className="mt-[1.6rem] flex flex-col gap-[1.6rem] md:mt-[2rem] md:gap-[2rem]">
          <div className="flex items-center gap-[1rem]">
            <div className="bg-muted relative grid grid-cols-3 rounded-full p-[0.3rem]">
              <SegmentedIndicator count={SEARCH_RANGES.length} index={SEARCH_RANGES.findIndex(option => option.value === range)} className="bg-card rounded-full shadow-sm" />
              {SEARCH_RANGES.map(option => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleRange(option.value)}
                  aria-pressed={range === option.value}
                  className={`relative z-10 rounded-full px-[1.2rem] py-[0.55rem] text-xs font-bold transition-colors duration-200 ${range === option.value ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-muted-foreground mb-[0.9rem] text-xs font-bold">카테고리</p>
            <div className="scroll-container -mx-[0.2rem] flex gap-[0.7rem] px-[0.2rem] pb-[0.2rem]">
              <button
                type="button"
                onClick={() => handleCategory(null)}
                aria-pressed={category === null}
                className={`shrink-0 rounded-full border px-[1.4rem] py-[0.7rem] text-sm font-bold transition-all ${category === null ? "bg-primary text-primary-foreground border-transparent shadow-sm" : "bg-card text-muted-foreground border-border hover:border-primary/30 hover:text-foreground"}`}
              >
                전체
              </button>
              {CATEGORIES.map(option => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleCategory(option)}
                  aria-pressed={category === option}
                  className={`shrink-0 rounded-full border px-[1.4rem] py-[0.7rem] text-sm font-bold transition-all ${category === option ? "bg-primary text-primary-foreground border-transparent shadow-sm" : "bg-card text-muted-foreground border-border hover:border-primary/30 hover:text-foreground"}`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-[1.8rem] min-h-[5.2rem] md:mt-[2.2rem]" aria-labelledby="recent-search-title">
        <div className="mb-[0.9rem] flex items-center justify-between">
          <h2 id="recent-search-title" className="text-foreground inline-flex items-center gap-[0.5rem] text-sm font-bold">
            <LuClock3 className="text-muted-foreground h-[1.5rem] w-[1.5rem] stroke-[2]" />
            최근 검색어
          </h2>
          {recentSearches.length > 0 && (
            <button
              type="button"
              onClick={handleClearRecentSearches}
              className="text-muted-foreground hover:text-foreground inline-flex items-center gap-[0.35rem] text-xs font-medium transition-colors"
            >
              <LuTrash2 className="h-[1.3rem] w-[1.3rem]" />
              전체 삭제
            </button>
          )}
        </div>

        {recentSearches.length > 0 ? (
          <div className="flex flex-wrap gap-[0.7rem]">
            {recentSearches.map(item => (
              <div key={item} className="border-border bg-card inline-flex items-center overflow-hidden rounded-full border">
                <button
                  type="button"
                  onClick={() => handleRecentKeyword(item)}
                  className="text-foreground/80 hover:text-primary py-[0.65rem] pr-[0.45rem] pl-[1.1rem] text-sm font-medium transition-colors"
                >
                  {item}
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveRecentKeyword(item)}
                  aria-label={`${item} 최근 검색어 삭제`}
                  className="text-muted-foreground hover:text-foreground grid h-[3rem] w-[2.8rem] place-items-center transition-colors"
                >
                  <LuX className="h-[1.3rem] w-[1.3rem] stroke-[2.2]" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">아직 최근 검색어가 없어요.</p>
        )}
      </section>
    </div>
  );
};

export default SearchForm;
