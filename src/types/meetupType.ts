export interface Meetup {
  organizer: {
    nickname: string;
    profileImage: string;
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
  adEndedAt: string | null;
  isPublic: boolean;
  image?: string;
  category: string;
}

export interface NewMeetup extends Omit<Meetup, "id"> {}

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
}

export interface LabeledSelectProps {
  id: string;
  name: string;
  label: string;
  options: string[];
  defaultValue?: string | undefined;
  required: boolean;
  multiple?: boolean;
}

export type SortType = "popular" | "newest" | "adDeadline";
