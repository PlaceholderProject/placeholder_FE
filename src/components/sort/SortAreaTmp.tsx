// "use client";

// import React, { useState } from "react";
// import Cookies from "js-cookie";
// import { BASE_URL } from "@/constants/baseURL";

// const SortArea = () => {
//   const getSortedMeetup = async () => {
//     const token = Cookies.get("accessToken");
//     const response = await fetch(`${BASE_URL}/api/v1/meetup?${sortType}`, {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${token}`
//       },
//     });

//   const sortedMeetupData = await response.json();
//   return sortedMeetupData;

//   };
//   // 인기 => "like" 쿼리스트링
//   // 최신 => "latest"
//   // 마감임박 => "deadline"

//   const [sortType, setSortType] = useState("like");

//   const handleSortChange = (newSortType: string) => {
//     setSortType(newSortType);
//   };
//   return <div></div>;
// };

// export default SortArea;
