"use client";

import { setSearchField, setSearchedAds, setTotal } from "@/stores/searchSlice";
import { TypePurposeType } from "@/types/meetupType";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { LuSearch, LuX } from "react-icons/lu";
import { useDispatch } from "react-redux";
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
  const [range, setRange] = useState("ad_title");
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState<TypePurposeType>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const router = useRouter();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchField({ range: "ad_title", keyword: "", category: null }));
    dispatch(setSearchedAds([]));
    dispatch(setTotal(0));
  }, [dispatch]);

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

  const saveRecentSearch = (nextKeyword: string) => {
    const trimmedKeyword = nextKeyword.trim();
    if (!trimmedKeyword) return;

    setRecentSearches(prev => {
      const nextSearches = [trimmedKeyword, ...prev.filter(item => item !== trimmedKeyword)].slice(0, MAX_RECENT_SEARCHES);
      window.localStorage.setItem(RECENT_SEARCH_STORAGE_KEY, JSON.stringify(nextSearches));
      return nextSearches;
    });
  };

  const handleKeyword = (event: ChangeEvent<HTMLInputElement>) => {
    const nextKeyword = event.target.value;
    setKeyword(nextKeyword);
    dispatch(setSearchField({ range, keyword: nextKeyword.trim(), category }));
  };

  const handleClearKeyword = () => {
    setKeyword("");
    dispatch(setSearchField({ range, keyword: "", category }));
  };

  const handleRange = (nextRange: string) => {
    setRange(nextRange);
    dispatch(setSearchField({ range: nextRange, keyword: keyword.trim(), category }));
  };

  const handleRecentKeyword = (nextKeyword: string) => {
    setKeyword(nextKeyword);
    dispatch(setSearchField({ range, keyword: nextKeyword, category }));
    saveRecentSearch(nextKeyword);
    router.push("/search");
  };

  const handleCategory = (nextCategory: TypePurposeType) => {
    setCategory(nextCategory);
    dispatch(setSearchField({ range, keyword: keyword.trim(), category: nextCategory }));
  };

  const handleKeywordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (keyword.trim().length === 0) {
      toast.error("검색어를 입력해주세요.");
      return;
    }

    dispatch(setSearchField({ range, keyword: keyword.trim(), category }));
    saveRecentSearch(keyword);

    router.push("/search");
  };

  return (
    <div className="mx-auto w-[95%] space-y-[1.8rem] pt-[1.8rem] md:max-w-[100rem] md:pt-[2rem]">
      <div>
        <form onSubmit={handleKeywordSubmit} className="bg-card border-border flex min-h-[4.8rem] items-center gap-[0.9rem] rounded-[1.4rem] border px-[1.4rem] py-[1rem] transition-colors">
          <LuSearch className="text-muted-foreground h-[1.9rem] w-[1.9rem] shrink-0 stroke-[1.8]" />
          <input
            type="search"
            autoFocus
            onChange={handleKeyword}
            value={keyword}
            placeholder="모임, 관심사, 지역을 검색해보세요"
            className="placeholder:text-muted-foreground min-w-0 flex-1 [appearance:textfield] bg-transparent text-base focus:outline-none [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-cancel-button]:appearance-none"
          />
          {keyword && (
            <button type="button" onClick={handleClearKeyword} aria-label="검색어 지우기" className="text-muted-foreground hover:text-foreground shrink-0 transition-colors">
              <LuX className="h-[1.7rem] w-[1.7rem] stroke-[2]" />
            </button>
          )}
          <button type="submit" className="sr-only">
            검색
          </button>
        </form>
      </div>

      <div className="scroll-container flex gap-[0.7rem] pb-[0.2rem]">
        {SEARCH_RANGES.map(option => (
          <button
            key={option.value}
            type="button"
            onClick={() => handleRange(option.value)}
            className={`shrink-0 rounded-full border px-[1.2rem] py-[0.6rem] text-sm font-medium transition-all duration-150 ${
              range === option.value ? "bg-primary-soft text-primary border-transparent shadow-sm" : "bg-card text-muted-foreground border-border hover:border-primary/30 hover:text-foreground"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <section className="space-y-[1rem]">
        <h2 className="text-muted-foreground text-sm font-medium">최근 검색어</h2>
        {recentSearches.length > 0 ? (
          <div className="flex flex-wrap gap-[0.8rem]">
            {recentSearches.map(item => (
              <button
                key={item}
                type="button"
                onClick={() => handleRecentKeyword(item)}
                className="bg-muted text-foreground/80 hover:text-foreground inline-flex items-center gap-[0.4rem] rounded-full px-[1.1rem] py-[0.6rem] text-sm transition"
              >
                {item}
                <LuX className="text-muted-foreground h-[1.2rem] w-[1.2rem] stroke-[2]" />
              </button>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">아직 최근 검색어가 없어요.</p>
        )}
      </section>

      <div className="scroll-container flex gap-[0.7rem] pb-[0.2rem]">
        <button
          type="button"
          onClick={() => handleCategory(null)}
          className={`shrink-0 rounded-full border px-[1.4rem] py-[0.7rem] text-sm font-medium transition-all duration-150 ${
            category === null ? "bg-foreground text-background border-transparent shadow-sm" : "bg-card text-muted-foreground border-border hover:border-foreground/30 hover:text-foreground"
          }`}
        >
          전체
        </button>
        {CATEGORIES.map(option => (
          <button
            key={option}
            type="button"
            onClick={() => handleCategory(option)}
            className={`shrink-0 rounded-full border px-[1.4rem] py-[0.7rem] text-sm font-medium transition-all duration-150 ${
              category === option ? "bg-foreground text-background border-transparent shadow-sm" : "bg-card text-muted-foreground border-border hover:border-foreground/30 hover:text-foreground"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchForm;
