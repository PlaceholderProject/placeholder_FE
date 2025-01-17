"use client";

import React, { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Meetup } from "@/types/meetupType";
import { LabeledInputProps } from "@/types/meetupType";
import { LabeledSelectProps } from "@/types/meetupType";
import { useRouter } from "next/navigation";
import { BASE_URL } from "@/constants/baseURL";
import { editMeetupApi, getMeetupByIdApi } from "@/services/meetup.service";

const token = process.env.NEXT_PUBLIC_MY_TOKEN;

const LabeledInput = React.forwardRef<HTMLInputElement, LabeledInputProps>(
  ({ id, name, label, type, placeholder, value, defaultValue, defaultChecked, disabled, required, checked, onChange }, ref) => (
    <div>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        defaultChecked={defaultChecked}
        disabled={disabled}
        required={required}
        checked={checked}
        onChange={onChange}
        ref={ref}
      />
    </div>
  ),
);

const LabeledSelect = React.forwardRef<HTMLSelectElement, LabeledSelectProps>(({ id, name, label, options, defaultValue, multiple = true, required = true }, ref) => (
  <div>
    <label htmlFor={id}>{label}</label>
    <select id={id} name={name} defaultValue={defaultValue} required={required} ref={ref}>
      {options.map(option => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
));

const MeetupEditForm = ({ meetupId }: { meetupId: number }) => {
  const queryClient = useQueryClient();
  const nameRef = useRef<HTMLInputElement>(null);
  const startedAtRef = useRef<HTMLInputElement>(null);
  const endedAtRef = useRef<HTMLInputElement>(null);
  const placeRef = useRef<HTMLSelectElement>(null);
  const placeDescriptionRef = useRef<HTMLInputElement>(null);
  const adTitleRef = useRef<HTMLInputElement>(null);
  const adEndedAtRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const isPublicRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLSelectElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  // 🍰🍰🍰🍰🍰🍰🍰🍰🍰🍰 useEffect를 시작, 종료 날짜 미정 체크에 또 써야 하는데 🍰🍰🍰🍰🍰🍰🍰🍰🍰🍰🍰🍰
  // 🍰🍰🍰🍰🍰🍰🍰🍰🍰 이거 나중에 커스텀훅으로 묶을까? 🍰🍰🍰🍰🍰🍰🍰🍰🍰

  // 체크 박스 상태 관리 스테이트
  const [isStartedAtNull, setIsStartedAtNull] = useState(false);
  const [isEndedAtNull, setIsEndedAtNull] = useState(false);

  const router = useRouter();
  // const [previewImage, setPreviewImage] = useState<string | null>("image:/media/meetup_images/pv_test.JPG");
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // id 해당 모임 get api
  // const getMeetupById = async () => {
  //   const response = await fetch(`${BASE_URL}/api/v1/meetup/${meetupId}`, {
  //     method: "GET",
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   });

  //   if (!response.ok) {
  //     console.error("가져오기 실패: ", response.status, response.statusText);
  //     throw new Error("해당 id 모임 가져오기 실패");
  //   }

  //   const meetupByIdData = await response.json();
  //   // console.log("json()하지 않은 해당 id 모임: ", response);
  //   // console.log("가져온 해당 id 모임:", meetupByIdData.json());
  //   // 아니 왜 콘솔에 .json() 넣으면 브라우저 에러 나는 것?
  //   // 안 그러다기???????????????

  //   // // 🫠🫠🫠🫠🫠🫠🫠🫠🫠🫠🫠🫠🫠🫠🫠🫠 이거는 필요 없고 onSuccess에서 하면 됨 되는거야 마는거야 🫠🫠🫠🫠🫠🫠🫠🫠🫠🫠🫠🫠🫠🫠🫠🫠🫠 아마 안됨
  //   // setPreviewImage(`${meetupByIdData.image}`);

  //   console.log("가져온 데이터: ", meetupByIdData);
  //   console.log("meetupId 타입 뭐야?", typeof meetupByIdData.id);

  //   return meetupByIdData;
  // };

  //id 해당 모임 가져오기 탠스택
  // 🟨 이것도 왜 필요한지 모르겠는데 갑자기? 캐싱떄문이야?
  const {
    data: previousMeetupData,
    isPending,
    isError,
  } = useQuery<Meetup, Error>({
    queryKey: ["meetup", meetupId],
    queryFn: () => getMeetupByIdApi(meetupId),

    // 💞 onSuccess는 queryFn인 metMeetupById가 데이터 반환에 성공했을 때 호출됨
    // 💞 queryFn에서 반환한 데이터를 onSuccess의 매개변수로 전달
    // 💞 즉 data는 getMeetupById의 반환값인 meetupByIdData

    // onSuccess: (meetupByIdData: Meetup) => {
    //   // 💞 여기서 meetupByIdData를 매개면수로 받고 있으므로 이걸 써야돼

    //   if (meetupByIdData.image) {
    //     // console.log(`이전 미리보기 url: http://localhost:8000/api/v1${data.image}`);

    //     // setPreviewImage(`http://localhost:8000${previousMeetupData.image}`);
    //     setPreviewImage(`http://localhost:8000${meetupByIdData.image}`);
    //   }
    // },

    retry: 0,
  });

  useEffect(() => {
    if (previousMeetupData?.image) {
      const imageUrl = `${BASE_URL}${previousMeetupData.image}`;
      console.log("미리보기 설정되는 이미지 URL: ", imageUrl);
      setPreviewImage(imageUrl);
    }
  }, [previousMeetupData]);

  useEffect(() => {
    previousMeetupData?.startedAt === null ? setIsStartedAtNull(true) : setIsStartedAtNull(false);
    previousMeetupData?.endedAt === null ? setIsEndedAtNull(true) : setIsEndedAtNull(false);
  }, [previousMeetupData]);

  // 수정 api
  // const editMeetupApi = async (formData: FormData): Promise<void> => {
  //   const response = await fetch(`${BASE_URL}/api/v1/meetup/${meetupId}`, {
  //     method: "PUT",
  //     headers: { Authorization: `Bearer ${token}` },
  //     body: formData,
  //   });
  //   if (!response.ok) {
  //     throw new Error("모임 수정 실패");
  //   }

  //   // 🚨🚨🚨🚨🚨서버 응답 형태 확인용 지금 date랑 checkbox 인풋만 수정이 안되거든요🚨🚨🚨🚨🚨

  //   const responseData = await response.json();
  //   console.log("서버 응답:", responseData);
  //   return responseData;
  // };

  //수정 뮤테이션
  // 근데 뮤테이션은 최상단에 위치시키라고 했던거같은데
  const editMutation = useMutation<void, Error, FormData>({
    mutationFn: formData => editMeetupApi(meetupId, formData),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meetup", meetupId] });
      queryClient.invalidateQueries({ queryKey: ["meetups"] });
      // queryClient.invalidateQueries({ queryKey: ["headhuntings"] });
      alert("onSuccess invalidate 모임 정보 수정 성공!");
      router.push("/");
    },
  });

  const categoryOptions = ["운동", "공부", "취준", "취미", "친목", "맛집", "여행", "기타"];
  const placeOptions = ["서울", "경기", "인천", "강원", "대전", "세종", "충남", "충북", "부산", "울산", "경남", "경북", "대구", "광주", "전남", "전북", "제주", "전국", "미정"];

  const handleEditFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!previousMeetupData) return;

    const editedMeetup: Meetup = {
      ...previousMeetupData,
      name: nameRef.current?.value || "",
      description: descriptionRef.current?.value || "",
      place: placeRef.current?.value || "",
      placeDescription: placeDescriptionRef.current?.value || "",
      startedAt: isStartedAtNull ? null : startedAtRef.current?.value || null,
      endedAt: isEndedAtNull ? null : endedAtRef.current?.value || null,
      adTitle: adTitleRef.current?.value || "",
      adEndedAt: adEndedAtRef.current?.value || null,
      // 수정전: isPublic: isPublicRef.current?.checked || false,
      isPublic: isPublicRef.current?.checked, //이래도 안됨
      category: categoryRef.current?.value || "",
      image: imageRef.current?.value || "",
    };

    const formData = new FormData();

    formData.append("payload", JSON.stringify(editedMeetup));

    if (imageRef.current?.files?.[0]) {
      const file = imageRef.current.files[0];
      formData.append("image", file);
    }

    const payload = formData.get("payload");
    console.log("서버로 전송되는 수정된 모임 데이터:", JSON.stringify(payload as string));
    editMutation.mutate(formData);
  };

  const handlePreviewImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const previewFile = event.target.files[0];
      const previewFileUrl = URL.createObjectURL(previewFile);
      setPreviewImage(previewFileUrl);
    }
  };

  if (isPending) return <p>Pending...</p>;
  if (isError) return <p>모임 데이터 로드 error남</p>;

  // console.log("🔮🔮🔮🔮🔮🔮  성공한 미리보기 previousMeetupData.image 스트링🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮 : ", previousMeetupData.image);
  return (
    <>
      {/* // <img src={`http://localhost:8000${previousMeetupData.image}`} alt="성공한 테스트" />
      // <p>성공한 이미지는 위에⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️ 뜰 것입니다</p>
      // <img src={`http://localhost:8000meetup_images/pv_test.JPG`} alt="⬅️ 경로 테스트 실패한 이미지태그" /> */}

      <form onSubmit={handleEditFormSubmit}>
        <LabeledInput id="name" name="name" label="모임 이름" type="text" ref={nameRef} defaultValue={previousMeetupData?.name} required />
        <LabeledSelect id="category" name="category" label="모임 성격" options={categoryOptions} ref={categoryRef} defaultValue={previousMeetupData?.category} required />
        <LabeledInput
          id="startedAt"
          name="startedAt"
          label="모임 시작 날짜"
          type="date"
          ref={startedAtRef}
          defaultValue={previousMeetupData?.startedAt ? previousMeetupData.startedAt.substring(0, 10) : undefined}
          disabled={isStartedAtNull}
          required
        />

        <LabeledInput
          id="startedAtUndecided"
          name="startedAtUndecided"
          label="미정"
          type="checkbox"
          checked={isStartedAtNull}
          onChange={event => {
            setIsStartedAtNull(event?.target.checked);
          }}
        />

        <LabeledInput id="endedAt" name="endedAt" label="모임 종료 날짜" type="date" ref={endedAtRef} defaultValue={previousMeetupData?.endedAt?.substring(0, 10)} disabled={isEndedAtNull} required />
        <LabeledInput
          id="endedAtUndecided"
          name="endedAtUndecided"
          label="미정"
          type="checkbox"
          checked={isEndedAtNull}
          onChange={event => {
            setIsEndedAtNull(event?.target.checked);
          }}
        />

        <LabeledSelect id="place" name="place" label="모임 지역" options={placeOptions} ref={placeRef} defaultValue={previousMeetupData?.place} required />
        <LabeledInput id="placeDescription" name="placeDescription" label="모임 장소 설명" type="text" ref={placeDescriptionRef} defaultValue={previousMeetupData?.placeDescription} required />
        <LabeledInput id="adTitle" name="adTitle" label="광고 제목" type="text" ref={adTitleRef} defaultValue={previousMeetupData?.adTitle} required />
        <LabeledInput id="adEndedAt" name="adEndedAt" label="광고 종료 날짜" type="date" ref={adEndedAtRef} defaultValue={previousMeetupData?.adEndedAt?.substring(0, 10)} />
        <label htmlFor="description">광고글 설명</label>
        <textarea id="description" name="description" ref={descriptionRef} defaultValue={previousMeetupData?.description || ""} placeholder="설명을 작성하세요" />
        <LabeledInput id="isPublic" name="isPublic" label="공개 여부" type="checkbox" ref={isPublicRef} defaultChecked={previousMeetupData?.isPublic} />
        <div>
          {/* <h3>선택된 이미지</h3>
          <img src={`http://localhost:8000${previousMeetupData.image}`} alt="Preview" />
          🍓🍓🍓🍓🍓🍓🍓🍓🍓이렇게 그냥 갖다 쓰니까 미리보기 된다고?🍓🍓🍓🍓🍓🍓🍓🍓🍓🍓 */}
          {previewImage ? <img src={previewImage} alt="미리보기 대체 텍스트" /> : <p>미리보기 이미지 없다</p>}
          {/* 🧚🏼‍♀️🧚🏼‍♀️🧚🏼‍♀️🧚🏼‍♀️🧚🏼‍♀️🧚🏼‍♀️🧚🏼‍♀️🧚🏼‍♀️이거는 지금 소스 경로를 previewImage로 설정해놨고 아마 setPreviewImage가 다시 안 쓰여서 기본값 null로 뜬거같다.🧚🏼‍♀️🧚🏼‍♀️🧚🏼‍♀️🧚🏼‍♀️🧚🏼‍♀️🧚🏼‍♀️ */}
          <LabeledInput
            id="image"
            name="image"
            label="광고글 대표 이미지"
            type="file"
            accept="image/jpg, image/jpeg, image/png, image/webp, image/bmp"
            ref={imageRef}
            onChange={handlePreviewImageChange}
          />
        </div>
        <button type="submit">수정 완료</button>
      </form>
    </>
  );
};

export default MeetupEditForm;
