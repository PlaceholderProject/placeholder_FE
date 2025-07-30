import SearchForm from "@/components/search/SearchForm";
import SearchedResultArea from "@/components/search/SearchedResultArea";
import React from "react";

const SearchPage = () => {
  return (
    <div>
      <SearchForm />
      <SearchedResultArea />
    </div>
  );
};

export default SearchPage;
