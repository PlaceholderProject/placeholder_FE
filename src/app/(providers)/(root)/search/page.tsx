import SearchForm from "@/components/search/SearchForm";
import SearchedResultArea from "@/components/search/SearchedResultArea";
import React from "react";

const SearchPage = () => {
  return (
    <div className="pb-[4rem]">
      <SearchForm />
      <SearchedResultArea />
    </div>
  );
};

export default SearchPage;
