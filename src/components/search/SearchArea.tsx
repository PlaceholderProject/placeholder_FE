"use client";

import { getSearchedAd } from "@/services/search.service";
import { setSearchedAds, setSearchField, setTotal } from "@/stores/searchSlice";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useDispatch } from "react-redux";

const SearchArea = () => {
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
      alert("검색어를 입력해주세요.");
      return;
    }
    const result = await getSearchedAd(range, keyword, 1);

    dispatch(setSearchedAds(result?.proposals));
    dispatch(setSearchField({ range, keyword }));
    dispatch(setTotal(result?.total));

    router.push("/search");
  };

  return (
    <div className="bg-secondary-dark relative pt-[12.5rem]">
      <form onSubmit={handleKeywordSubmit} className="absolute bottom-[1.5rem] flex w-full justify-center gap-[1.5rem]">
        <div className="flex h-[3.5rem] cursor-pointer justify-center rounded-full bg-white px-[1rem] py-[0.5rem] shadow-sm">
          <select onChange={handleRange} className="cursor-pointer border-none outline-none">
            <option value="ad_title">제목</option>
            <option value="organizer">작성자</option>
            <option value="description">내용</option>
          </select>
        </div>
        <div className="relative">
          <input
            type="search"
            onChange={handleKeyword}
            value={keyword}
            className="h-[3.5rem] w-[24rem] rounded-full pl-[1.5rem] pr-[4rem] shadow-sm [appearance:textfield] focus:outline-none [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-cancel-button]:appearance-none"
          />
          <button type="submit" className="text-gray-dark absolute right-[1.5rem] top-[0.8rem] text-[1.8rem]">
            <FaSearch />
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchArea;
