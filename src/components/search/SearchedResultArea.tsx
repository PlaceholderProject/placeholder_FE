"use client";

import React from "react";
import { RootState } from "@/stores/store";
import { useSelector } from "react-redux";
import SearchedResultItem from "./SearchedResultItem";
import { SearchedType } from "@/types/searchType";

const SearchedResultArea = () => {
  const { searchedAds } = useSelector((state: RootState) => state.search);

  if (!searchedAds || searchedAds.length === 0) {
    return <div>검색결과가 없습니다.</div>;
  }

  console.log(searchedAds);
  return (
    <ul>
      {searchedAds.map((ad: SearchedType) => (
        <li key={ad.id}>
          <SearchedResultItem ad={ad} />
        </li>
      ))}
    </ul>
  );
};

export default SearchedResultArea;
