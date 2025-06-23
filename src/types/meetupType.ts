export interface Meetup {
  organizer: {
    nickname: string;
    image: string;
  };
  isLike: boolean;
  likeCount: number;
  id: number; // 24.01.07 ThumbnailArea에 광고 아이템 하나씩 띄우는데 타입 필요해서 추가함
  // 25.03.14 id 뒤에 물음표 있었는데 ThumbnailArea에서 undefined는 할당할 수 없다고 타입 오류나서 지움
  name: string;
  description: string;
  place: string;
  placeDescription: string;
  startedAt: string | null;
  endedAt: string | null;
  adTitle: string;
  adEndedAt: string;
  isPublic: boolean;
  image?: string;
  category: string;
  createdAt: string;
  commentCount: number;
  pages: number[];
}

export interface NewMeetup {
  organizer: {
    nickname: string;
    image: string;
  };
  isLike: boolean;
  likeCount: number;
  name: string;
  description: string;
  place: string;
  placeDescription: string;
  startedAt: string | null;
  endedAt: string | null;
  adTitle: string;
  adEndedAt: string;
  isPublic: boolean;
  image?: string;
  category: string;
  createdAt: string;
  commentCount: number;
}

export interface LabeledInputProps {
  id: string;
  name: string;
  label: string;
  type?: string; // 인풋 타입 (기본값: "text")
  placeholder?: string; // 선택적 placeholder
  value?: string | number | readonly string[] | undefined;
  defaultValue?: string;
  minlength?: string;
  maxlength?: string;
  required?: boolean;
  disabled?: boolean;
  checked?: boolean;
  defaultChecked?: boolean;
  accept?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  maxLength?: number;
  className?: string;
  labelClassName?: string;
  containerClassName?: string;
}

export interface LabeledSelectProps {
  id: string;
  name: string;
  label: string;
  options: string[];
  defaultValue?: string | undefined;
  required: boolean;
  multiple?: boolean;
  className?: string;
  labelClassName?: string;
  containerClassName?: string;
}

export type SortType = "like" | "latest" | "deadline";

// --TO DO--
// PlaceButtons.tsx CategoryButtons.tsx에서 중복 코드 간결화

export type TypeRegionType =
  | null
  | "서울"
  | "경기"
  | "인천"
  | "강원"
  | "대전"
  | "세종"
  | "충남"
  | "충북"
  | "부산"
  | "울산"
  | "경남"
  | "경북"
  | "대구"
  | "광주"
  | "전남"
  | "전북"
  | "제주"
  | "미정"
  | "전국";

export type TypePurposeType = null | "운동" | "공부" | "취준" | "취미" | "친목" | "맛집" | "여행" | "기타";

export type FilterAreaType = null | "지역별" | "모임 성격별";

export type FileType = "image/jpg" | "image/jpeg" | "image/png" | "image/webp" | "image/bmp";

export interface S3PresignedField {
  "Content-Type": string;
  key: string;
  policy: string;
  success_action_status: string;
  "x-amz-algorithm": string;
  "x-amz-credential": string;
  "x-amz-date": string;
  "x-amz-signature": string;
}

export interface S3PresignedItem {
  url: string;
  fields: S3PresignedField;
}

export interface S3PresignedResponse {
  result: S3PresignedItem[];
}
