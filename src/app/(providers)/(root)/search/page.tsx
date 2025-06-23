import SearchForm from "@/components/search/SearchForm";
import SearchedResultArea from "@/components/search/SearchedResultArea";
import React from "react";

const page = () => {
  return (
    <div>
      <SearchForm />
      <SearchedResultArea />
    </div>
  );
};

export default page;
