"use client";

import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

const SearchArea = () => {
  const [range, setRange] = useState("ad_title");
  const [keyword, setKeyword] = useState("");

  const handleRange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRange(event.target.value);
  };

  const handleKeyword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value);
  };

  const handleKeywordSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("range", range);
    console.log("keyword", keyword);
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
