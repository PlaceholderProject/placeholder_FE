"use client";

import React, { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Meetup } from "@/types/meetupType";
import { LabeledInputProps } from "@/types/meetupType";
import { LabeledSelectProps } from "@/types/meetupType";
import { useRouter } from "next/navigation";
import { refreshToken } from "@/services/auth.service";
import { BASE_URL } from "@/constants/baseURL";
import { createMeetupApi } from "@/services/meetup.service";

const token = process.env.NEXT_PUBLIC_MY_TOKEN;

const LabeledInput = React.forwardRef<HTMLInputElement, LabeledInputProps>(({ id, name, label, type, placeholder, value, defaultValue, disabled, required, checked, onChange }, ref) => {
  return (
    <>
      <div>
        <label htmlFor={id}>{label}</label>
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          value={value}
          defaultValue={defaultValue}
          required={required}
          checked={checked}
          onChange={onChange}
          ref={ref}
        />
      </div>
    </>
  );
});

const LabeledSelect = React.forwardRef<HTMLSelectElement, LabeledSelectProps>(({ id, name, label, options, required = true }, ref) => {
  return (
    <>
      <div>
        <label htmlFor={id}>{label}</label>
        <select id={id} name={name} required={required} ref={ref}>
          {options.map(option => {
            return (
              <option key={option} value={option}>
                {option}
              </option>
            );
          })}
        </select>
      </div>
    </>
  );
});

const MeetupForm = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Ref
  const nameRef = useRef<HTMLInputElement>(null);
  const startedAtRef = useRef<HTMLInputElement>(null);
  const endedAtRef = useRef<HTMLInputElement>(null);
  const placeRef = useRef<HTMLSelectElement>(null);
  const placeDescriptionRef = useRef<HTMLInputElement>(null);
  const adTitleRef = useRef<HTMLInputElement>(null);
  const adEndedAtRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const isPublicRef = useRef<HTMLInputElement>(null); //초기값 왜 null
  const categoryRef = useRef<HTMLSelectElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  // 체크 박스 상태 관리 위한 스테이트
  const [isStartedAtNull, setIsStartedAtNull] = useState(false);
  const [isEndedAtNull, setIsEndedAtNull] = useState(false);
  // 미리보기 스테이트
  const [previewImage, setPreviewImage] = useState("/meetup_default_image.jpg");

  // 셀렉트 배열
  const categoryOptions = ["운동", "공부", "취준", "취미", "친목", "맛집", "여행", "기타"];
  const placeOptions = ["서울", "경기", "인천", "강원", "대전", "세종", "충남", "충북", "부산", "울산", "경남", "경북", "대구", "광주", "전남", "전북", "제주", "전국", "미정"];

  // useMutation은 최상단에 위치시키라고 함
  const createMutation = useMutation({
    mutationFn: (meetupFormData: FormData) => createMeetupApi(meetupFormData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meetups"] });
      router.push("/");
    },

    onError: error => {
      console.error("모임 생성 오류 발생:", error);
    },
  });

  // 모임 생성 api
  // const createMeetupApi = async (blobFormData: FormData): Promise<void> => {
  //   const response = await fetch(`${BASE_URL}/api/v1/meetup`, {
  //     method: "POST",
  //     headers: {
  //       // ContentType: "multipart/formdata",
  //       Authorization: `Bearer ${token}`,
  //     },
  //     body: blobFormData,
  //   });

  //   if (!response.ok) {
  //     const errorText = await response.text();
  //     await refreshToken();
  //     console.log(errorText);
  //     throw new Error("모임 생성 실패");
  //   }
  //   return await response.json();
  // };

  const handleMeetupFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!categoryRef.current) {
      console.error("categoryRef가 인풋에 연결 안돼있어");
      return;
    }
    const category = categoryRef.current?.value || "";
    console.log("Submitted category", category);
    console.log("카테고리타입뭐야?:", typeof category);

    if (!nameRef.current) {
      console.error("nameRef가 인풋에 연걸 안돼있어");
      return;
    }
    const name = nameRef.current?.value || "";
    console.log("Submitted name:", name);

    if (!startedAtRef.current) {
      console.error("startedAtRef가 인풋에 연걸 안돼있어");
      return;
    }
    const startedAt = isStartedAtNull ? null : startedAtRef.current.value || null;
    console.log("Submitted startedAt:", startedAt);

    if (!endedAtRef.current) {
      console.error("endedAtRef가 인풋에 연걸 안돼있어");
      return;
    }
    const endedAt = isEndedAtNull ? null : endedAtRef.current.value || null;
    console.log("Submitted endedAt:", endedAt);

    if (!placeRef.current) {
      console.error("placeRef가 인풋에 연걸 안돼있어");
      return;
    }
    const place = placeRef.current?.value || "";
    console.log("Submitted place:", place);

    if (!placeDescriptionRef.current) {
      console.error("placeDescriptionRef가 인풋에 연결 안돼있어");
      return;
    }

    const placeDescription = placeDescriptionRef.current?.value || "";
    console.log("Submitted placeDescription:", placeDescription);

    if (!adTitleRef.current) {
      console.error("adTitleRef가 인풋에 연걸 안돼있어");
      return;
    }
    const adTitle = adTitleRef.current?.value || "";
    console.log("Submitted adTitle:", adTitle);

    if (!adEndedAtRef) {
      console.error("adEndedAtRef가 인풋에 연결 안돼있어");
      return;
    }
    const adEndedAt = adEndedAtRef.current?.value || "";
    console.log("Submitted adEndedAt:", adEndedAt);

    if (!descriptionRef) {
      console.error("descriptionRef가 인풋에 연결 안돼있어");
      return;
    }

    const description = descriptionRef.current?.value || "";
    console.log("Submitted description:", description);

    if (!isPublicRef) {
      console.error("isPublicRef가 인풋에 연결 안돼있어");
      return;
    }
    const isPublic = isPublicRef.current?.checked || false;
    console.log("Submitted isPublic:", isPublic);

    const image = imageRef.current?.value || "";
    console.log("Submitted image:", image);

    const newMeetup: Meetup = {
      name: nameRef.current?.value || "",
      description: descriptionRef.current?.value || "",
      place: placeRef.current?.value || "",
      placeDescription: placeDescriptionRef.current?.value || "",
      startedAt: startedAt,
      endedAt: endedAt,
      adTitle: adTitleRef.current?.value || "",
      adEndedAt: adEndedAtRef.current?.value || "",
      isPublic: isPublicRef.current?.checked || false, // `checked`로 값 가져오기
      category: categoryRef.current?.value || "",
      image: imageRef.current?.value || "",
    };

    const meetupFormData = new FormData();

    // 이미지 파일 추가

    // 이 코드면 meetup도 image도 binary로 나옴 => 바이너리가 필요할 때만 블롭으로 변환하세요
    // blob 사용하지 않으면 타입 정보 손실 위험성이 있다고 한다 pereplexity가 알려줌..

    // blobFormData.append("newMeetup", JSON.stringify(newMeetup));

    meetupFormData.append("payload", JSON.stringify(newMeetup));

    // formData.append("newMeetup", JSON.stringify(newMeetup));

    // if (imageRef.current?.files?.[0]) {
    //   blobFormData.append("image", imageRef.current.files[0]);
    // }

    if (imageRef.current?.files?.[0]) {
      const file = imageRef.current.files[0];
      console.log("이미지 파일 정보:", file.name, file.type, file.size);
      meetupFormData.append("image", file);
    } else {
      console.log("imageRef: ", imageRef);
      console.log("imageRef.current: ", imageRef.current);
      console.log("imageRef.current.value: ", imageRef.current?.value);
    }

    for (const pair of meetupFormData.entries()) {
      console.log("meetupFormData 출력:", pair[0], pair[1]); // key와 value 출력
    }

    createMutation.mutate(meetupFormData, {
      // 버튼 클릭되면 handleMeetupForm 실행
      // => 그 안에 지금 createMutation.mutate(formData) 있는거고
      // createMutation은 invalidasteQueries를 해
      // createMutation 안에 달린 mutationFn가 createMeetupApi 함수야 ("POST")
      // 원래 createMeetup 함수였는데 api 여서 이름 바꾼거야
      //

      // 🩵🩵🩵🩵🩵🩵🩵🩵🩵🩵  코드잇 보고 넣어봄 🩵🩵🩵🩵🩵🩵🩵🩵🩵🩵🩵🩵🩵🩵
      onSuccess: () => {
        alert("모임 생성 성공!!!!");
      },
    });
  };

  // 이미지 미리보기 스테이트
  const handlePreviewImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const previewFile = event.target.files[0];
      const previewFileUrl = URL.createObjectURL(previewFile);
      setPreviewImage(previewFileUrl);
    }
    console.log("미리보기 이미지:", previewImage);
  };

  return (
    <>
      <div>
        <form onSubmit={handleMeetupFormSubmit}>
          <div>
            <LabeledSelect id="category" name="category" label="모임 성격" options={categoryOptions} ref={categoryRef} required />

            <LabeledInput id="name" name="name" label="모임 이름(랜덤 생성 버튼 필요)" type="text" ref={nameRef} required />

            <LabeledInput id="startedAt" name="startedAt" label="모임 시작 날짜" type="date" ref={startedAtRef} disabled={isStartedAtNull} required />
            <LabeledInput
              id="startedAtUndecided"
              name="startedAtUndecided"
              label="미정"
              type="checkbox"
              // １. ref={isStartedAtNullRef}
              //checked={isStartedAtNullRef.current}를 위처럼 수정하고
              //onChage 지우니까 토글만 됨

              // 2.　useRef를 통해 상태를 저장, 리액트의 chekced와 disabled 속성을
              // useRef.current 기준으로 렌더링에 반영

              // checked={isStartedAtNullRef.current}
              // onChange={event => {
              //   isStartedAtNullRef.current = event?.target.checked;
              //   if (startedAtRef.current) {
              //     startedAtRef.current.disabled = event.target.checked;
              //   }
              // }}

              onChange={event => {
                setIsStartedAtNull(event.target.checked);
              }}
            />

            <LabeledInput id="endedAt" name="endedAt" label="모임 종료 날짜" type="date" ref={endedAtRef} disabled={isEndedAtNull} required />
            <LabeledInput
              id="endedAtUndecided"
              name="endedAtUndecided"
              label="미정"
              type="checkbox"
              onChange={event => {
                setIsEndedAtNull(event.target.checked);
              }}
            />

            <LabeledSelect id="category" name="category" label="모임 지역" options={placeOptions} ref={placeRef} required />
            <LabeledInput id="placeDescription" name="placeDescription" label="모임 장소" type="text" placeholder="만날 곳의 대략적 위치를 적어주세요. 예) 강남역" ref={placeDescriptionRef} required />

            <LabeledInput id="adTitle" name="adTitle" label="광고글 제목" type="text" ref={adTitleRef} required />

            <LabeledInput id="adEndedAt" name="adEndedAt" label="광고 종료 날짜" type="date" ref={adEndedAtRef} required />
          </div>
          <div>
            <label htmlFor="description">광고글 설명</label>
            <textarea id="description" name="description" defaultValue="" placeholder="멤버 광고글에 보일 설명을 적어주세요." ref={descriptionRef}></textarea>
          </div>

          <div>
            <h4>선택된 이미지</h4>
            <img src={previewImage} alt="previewImage" />
            <LabeledInput
              id="image"
              name="image"
              label="광고글 대표 이미지"
              type="file"
              accept="image/jpg, image/jpeg, image/png, image/webp, image/bmp"
              ref={imageRef}
              onChange={handlePreviewImageChange}
              required
            />
          </div>
          <LabeledInput id="isPublic" name="isPublic" label="광고글 공개하기" type="checkbox" ref={isPublicRef} />

          <div>
            <button type="submit">모임 생성하기</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default MeetupForm;

// 1. const newMeetup: Meetup 안에 image가 필요해?
// 필요 여부:

// 필요한 경우:
// 만약 서버가 image 필드(이미지의 파일 경로 또는 URL 등)를 기대하고 있다면, newMeetup 객체에 포함되어야 합니다. 예를 들어, 서버가 JSON 데이터를 처리하고 이미지를 별도로 저장하는 경우입니다. 이때 image는 파일의 경로(또는 이름)를 나타낼 수 있습니다.
// 필요하지 않은 경우:
// 서버가 이미지 파일을 multipart/form-data로 처리하고 JSON 데이터에는 이미지 관련 정보가 없거나 필요 없는 경우입니다. 이 경우 image는 newMeetup에 포함될 필요가 없습니다.
// 결론:

// 이미지 파일 자체를 FormData로 전송하고 JSON 데이터에 이미지 관련 정보가 필요 없다면, newMeetup에 image 필드는 필요 없습니다.
// 서버가 이미지를 JSON 데이터로도 받기를 기대한다면 포함해야 합니다.
