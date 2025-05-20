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
    <div className="bg-[#FBFFA9] p-4">
      <form onSubmit={handleKeywordSubmit}>
        <select onChange={handleRange}>
          <option value="ad_title">제목</option>
          <option value="organizer">작성자</option>
          <option value="description">내용</option>
        </select>
        <input type="search" onChange={handleKeyword} value={keyword}></input>
        <button type="submit">
          <FaSearch />
        </button>
      </form>
    </div>
  );
};

export default SearchArea;
