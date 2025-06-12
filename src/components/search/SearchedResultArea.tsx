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
  }, [page]);

  if (!searchedAds || searchedAds.length === 0) {
    return <div className="flex h-[30rem] items-center justify-center text-lg">검색결과가 없습니다.</div>;
  }

  return (
    <div className="my-[5rem] border-t-[0.1rem] border-gray-medium">
      <ul>
        {searchedAds.map((ad: SearchedType) => (
          <li key={ad.id}>
            <SearchedResultItem ad={ad} />
          </li>
        ))}
      </ul>
      <div className="mt-6 flex items-center justify-center gap-2">
        {/* 이전 그룹 버튼 */}
        {startPage > 1 && (
          <button onClick={() => setPage(startPage - 1)} className="rounded border bg-gray-200 px-2 py-1">
            이전
          </button>
        )}

        {/* 페이지 번호 버튼들 */}
        {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(p => (
          <button key={p} onClick={() => setPage(p)} className={`rounded border px-3 py-1 text-sm font-medium ${page === p ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
            {p}
          </button>
        ))}

        {/* 다음 그룹 버튼 */}
        {endPage < totalPages && (
          <button onClick={() => setPage(endPage + 1)} className="rounded border bg-gray-200 px-2 py-1">
            다음
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchedResultArea;
