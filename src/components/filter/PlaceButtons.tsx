import React from "react";
import { TypeRegionType } from "@/types/meetupType";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import { resetFilter, setPlace } from "@/stores/filterSlice";

const PlaceButtons = () => {
  const dispatch = useDispatch();
  const { place } = useSelector((state: RootState) => state.filter);
  const places: TypeRegionType[] = ["서울", "경기", "인천", "강원", "대전", "세종", "충남", "충북", "부산", "울산", "경남", "경북", "대구", "광주", "전남", "전북", "제주", "미정", "전국"];
  // --TO DO--
  // PlaceButtons.tsx CategoryButtons.tsx에서 중복 코드 간결화
  const handlePlaceSelect = (newPlace: TypeRegionType) => {
    if (place === newPlace) {
      dispatch(resetFilter());
    } else {
      dispatch(setPlace(newPlace));
    }
  };

  return (
    <>
      <div>
        <div>
          {places.map(placeItem => (
            <button
              key={placeItem}
              onClick={
                // 현재 placeItem이 막 클릭된 placeItem과 같다면 resetFilter를, 아니라면 handlePlaceSelect(placeItem)을 실행
                // 그러려면 막 클릭된 placeItem 값을 가져와서 평가한 뒤에 함수 린터값을 적용해야겠지

                () => handlePlaceSelect(placeItem)

                //                 그럼 event.target.value는 필요없어?

                // Event.target.value는 이 경우에 필요하지 않습니다.

                // React에서 map 함수로 생성된 버튼 클릭 이벤트에서는 이미 클릭된 아이템의 값을 placeItem 매개변수로 전달받고 있기 때문입니다. 클로저를 통해 각 버튼은 자신의 placeItem 값을 "기억"하고 있습니다.

                // 버튼 클릭 이벤트 핸들러를 다음과 같이 작성하면 됩니다:

                // typescript
                // onClick={() => handlePlaceSelect(placeItem)}
                // 이렇게 하면 클릭된 버튼에 해당하는 placeItem 값이 handlePlaceSelect 함수로 전달됩니다. 이 값과 현재 선택된 값(place)을 비교하여 같으면 null로 설정하고, 다르면 새 값으로 설정하는 로직이 동작합니다.

                // event.target.value는 주로 input 필드나 select 요소처럼 HTML 자체적으로 value 속성을 가진 요소에서 사용하는 방식입니다. 버튼에 value 속성을 추가할 수도 있지만, 이 경우 클로저 방식이 더 간결하고 React 스타일에 맞습니다.
              }
              className={`rounded-lg border px-3 py-1 text-sm ${place === placeItem ? "border-blue-400 bg-blue-200 text-blue-950" : "border-gray-400 bg-gray-100 text-gray-800"}`}
            >
              {placeItem}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default PlaceButtons;
