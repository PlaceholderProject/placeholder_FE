// "use client";
// import { toggleMemberDeleteModal } from "@/stores/modalSlice";
// import React from "react";
// import { useDispatch, useSelector } from "react-redux";
//
// import Cookies from "js-cookie";
// import { RootState } from "@/stores/store";
// import MyMeetupMembers from "./MyMeetupMembers";
// import { MyMeetupItem } from "@/types/mySpaceType";
//
// const token = Cookies.get("accessToken");
//
// const MemberDeleteModal: React.FC<{ meetupId: MyMeetupItem["id"] }> = ({ meetupId }) => {
//   const dispatch = useDispatch();
//   const isMemberDeleteModalOpen = useSelector((state: RootState) => state.modal.isMemberDeleteModalOpen);
//
//   //const queryClient = useQueryClient();
//
//   // 배경 누르면 모달 닫히는 그거인듯
//   const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
//     if (event.target === event.currentTarget) {
//       dispatch(toggleMemberDeleteModal());
//     }
//   };
//
//   // 모달 내부 클릭시 이벤트 전파 방지
//   const handleModalLayerClick = (event: React.MouseEvent<HTMLDivElement>) => {
//     event?.stopPropagation();
//   };
//
//   if (!isMemberDeleteModalOpen) return null;
//
//   // --TO DO--
//   // ❓Portal을 사용하는 것이 이상적이지만, 여기서는 z-index를 높게 설정하고 모달을 body 바로 아래에 렌더링
//
//   return (
//     <>
//       <div className="w-50 h-50 fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-5" onClick={handleOverlayClick}>
//         <div onClick={handleOverlayClick}>
//           <div className="rounded-md bg-white p-6 shadow-sm" onClick={handleModalLayerClick}>
//             <MyMeetupMembers meetupId={meetupId} />
//
//             <div className="flex justify-end space-x-2">
//               <button className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300" onClick={() => dispatch(toggleMemberDeleteModal())}>
//                 취소
//               </button>
//               {/* <OutButton /> */}
//               {/* 이거 퇴장으로 뜸 */}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };
//
// export default MemberDeleteModal;
