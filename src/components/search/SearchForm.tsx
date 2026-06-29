"use client";

import { setSearchField } from "@/stores/searchSlice";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

const SearchForm = () => {
  const [range, setRange] = useState("ad_title");
  const [keyword, setKeyword] = useState("");

  const router = useRouter();

  const dispatch = useDispatch();

  const handleRange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRange(event.target.value);
  };

  const handleKeyword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value);
  };

  const handleKeywordSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (keyword.trim().length === 0) {
      toast.error("검색어를 입력해주세요.");
      return;
    }

    dispatch(setSearchField({ range, keyword }));

    router.push("/search");
  };

  return (
    <div className="flex items-center justify-center md:h-[20rem]">
      <form
        onSubmit={handleKeywordSubmit}
        className="bg-card border-border flex h-[7.7rem] w-full flex-col items-center justify-center gap-[1rem] border-b md:mx-[2rem] md:h-[15rem] md:max-w-[80rem] md:rounded-[2rem] md:border md:shadow-sm"
      >
        <div className="hidden text-2xl font-medium md:block">모임 검색하기</div>
        <div className="flex gap-[1.5rem]">
          <div className="border-border flex h-[3.5rem] cursor-pointer justify-center rounded-full border bg-white px-[1rem] py-[0.5rem]">
            <select onChange={handleRange} className="cursor-pointer border-none bg-transparent outline-none">
              <option value="ad_title">제목</option>
              <option value="organizer">작성자</option>
              <option value="description">내용</option>
            </select>
          </div>
          <div className="border-border focus-within:border-primary relative flex items-center rounded-full border bg-white transition-colors">
            <input
              type="search"
              onChange={handleKeyword}
              value={keyword}
              placeholder="모임, 관심사, 지역을 검색해보세요"
              className="h-[3.5rem] w-[24rem] [appearance:textfield] rounded-full bg-transparent pr-[4rem] pl-[1.5rem] focus:outline-none md:w-[35rem] [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-cancel-button]:appearance-none"
            />
            <button type="submit" className="text-muted-foreground hover:text-primary absolute top-[0.8rem] right-[1.5rem] text-[1.8rem] transition-colors">
              <FaSearch />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;
