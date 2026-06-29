"use client";

import React, { useEffect, useState } from "react";
import { RootState } from "@/stores/store";
import { useDispatch, useSelector } from "react-redux";
import SearchedResultItem from "./SearchedResultItem";
import { SearchedType } from "@/types/searchType";
import { getSearchedAd } from "@/services/search.service";
import { setSearchedAds, setTotal } from "@/stores/searchSlice";

const SearchedResultArea = () => {
  const [page, setPage] = useState(1);

  const { searchedAds, searchField, total } = useSelector((state: RootState) => state.search);
  const dispatch = useDispatch();

  const size = 10;
  const groupSize = 5;
  const totalPages = Math.ceil(total / size);
  const currentGroup = Math.floor((page - 1) / groupSize);
  const startPage = currentGroup * groupSize + 1;
  const endPage = Math.min(startPage + groupSize - 1, totalPages);

  useEffect(() => {
    const fetchPage = async () => {
      const result = await getSearchedAd(searchField.range, searchField.keyword, page);
      dispatch(setSearchedAds(result?.proposals));
      dispatch(setTotal(result?.total));
    };

    fetchPage();
  }, [page, dispatch, searchField.keyword, searchField.range]);

  if (!searchedAds || searchedAds.length === 0) {
    return <div className="flex h-[30rem] items-center justify-center text-lg">검색결과가 없습니다.</div>;
  }

  return (
    <div className="mx-auto my-[4rem] w-[34rem] md:w-full md:max-w-[80rem]">
      <ul className="grid grid-cols-2 gap-[1.2rem] md:grid-cols-4">
        {searchedAds.map((ad: SearchedType) => (
          <li key={ad.id}>
            <SearchedResultItem ad={ad} />
          </li>
        ))}
      </ul>
      <div className="mt-[3rem] flex items-center justify-center gap-[0.6rem]">
        {/* 이전 그룹 버튼 */}
        {startPage > 1 && (
          <button onClick={() => setPage(startPage - 1)} className="bg-muted text-muted-foreground hover:bg-muted/70 rounded-full px-[1rem] py-[0.5rem] text-sm transition">
            이전
          </button>
        )}

        {/* 페이지 번호 버튼들 */}
        {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(p => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`rounded-full px-[1.2rem] py-[0.5rem] text-sm font-medium transition ${page === p ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70"}`}
          >
            {p}
          </button>
        ))}

        {/* 다음 그룹 버튼 */}
        {endPage < totalPages && (
          <button onClick={() => setPage(endPage + 1)} className="bg-muted text-muted-foreground hover:bg-muted/70 rounded-full px-[1rem] py-[0.5rem] text-sm transition">
            다음
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchedResultArea;
