"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import { SortType } from "@/types/meetupType";
import { setSortType } from "@/stores/sortSlice";
import SortButtons from "./SortButtons";

const SortArea = () => {
  const dispatch = useDispatch();
  const sortType = useSelector((state: RootState) => state.sort.sortType);
  // 이건 어디서 읽어오는지?
  // state.sort.sortType는 Redux 스토어의 상태에서 읽어오는 것입니다. 구체적으로:

  // state는 전체 Redux 스토어의 현재 상태를 나타냅니다.
  // sort는 스토어에 등록된 리듀서의 이름입니다 (sortSlice에서 name: "sort"로 정의한 부분).
  // sortType은 해당 리듀서 안에 있는 상태 속성입니다 (initialState에서 정의한 sortType: "like").

  // 이 값을 읽어오는 과정은 다음과 같습니다:

  // useSelector 훅이 Redux 스토어를 구독합니다.
  // 스토어 내부에서 store.js에 등록된 리듀서들 중에서 sort 리듀서를 찾습니다.
  // 그 리듀서 내부에서 sortType 속성의 현재 값을 가져옵니다.

  const handleSortChange = (newSortType: SortType) => {
    // newSortType은 어디서 튀어나왓냐?
    // 함수 파라미터로 선언이 된 것이고, 버튼 클릭이벤트에서 값을 바당온다
    console.log(`정렬 변경: ${sortType} -> ${newSortType}`);

    dispatch(setSortType(newSortType));
  };

  //   // 여기다가 SortType에 따른 로직을 따로 쓰게 해야지
  //   if (newSortType === "like") {
  //     alert("인기순이야");
  //   }

  //   if (newSortType === "latest") {
  //     alert("최신순이야");
  //   }

  //   if (newSortType === "deadline") {
  //     alert("마감 임받순이야");
  //   }
  // };

  return (
    <>
      <div className="my-[1rem] flex justify-start justify-items-center">
        <SortButtons currentSort={sortType} handleSortChange={handleSortChange} />
      </div>
    </>
  );
};

export default SortArea;
