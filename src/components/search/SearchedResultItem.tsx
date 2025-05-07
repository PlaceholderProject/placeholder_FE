import { SearchedType } from "@/types/searchType";
import React from "react";

const SearchedResultItem = ({ ad }: { ad: SearchedType }) => {
  return <div>{ad.adTitle}</div>;
};

export default SearchedResultItem;
