// "use client";

// import React from "react";
// import { useDispatch, UseDispatch, useSelector } from "react-redux";
// import { RootState } from "@/stores/store";
// import { PurposeType, RegionType } from "@/types/meetupType";
// import { resetFilter, setPurpose, setRegion } from "@/stores/filterSlice";

// const FilterButtons = () => {
//   const dispatch = useDispatch();
//   const { region, purpose, isFilterActive } = useSelector((state: RootState) => state.filter);

//   const regions: RegionType[] = [null, "서울", "경기", "인천", "강원", "대전", "세종", "충남", "충북", "부산", "울산", "경남", "경북", "대구", "광주", "전남", "전북", "제주", "미정", "전국"];
//   const purposes: PurposeType[] = [null, "운동", "공부", "취준", "취미", "친목", "맛집", "여행", "기타"];

//   const handleRegionChange = (newRegion: RegionType) => {
//     dispatch(setRegion(newRegion));
//   };

//   const handlePurposeChage = (newPurpose: PurposeType) => {
//     dispatch(setPurpose(newPurpose));
//   };

//   const handleResetFilter = () => {
//     dispatch(resetFilter());
//   };
//   return (
//     <>
//       <div>
//         <div>
//           {/* 지역 버튼들 */}
//           <div>
//             <h3 className="text-sm font-medium">지역별</h3>
//             <div className="flex flex-wrap gap-2">{regions}</div>
//           </div>
//         </div>

//         <div>
//           <h3 className="text-sm font-medium mb-1">모임 성격별</h3>
//           <div className="flex flex-wrap gap-2">{purposes}</div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default FilterButtons;
