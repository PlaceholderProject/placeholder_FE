export interface Meetup {
  organizer: {
    nickname: string;
    profileImage: string;
  };
  isLike?: boolean;
  likeCount?: number;
  id?: number; // 24.01.07 ThumbnailArea에 광고 아이템 하나씩 띄우는데 타입 필요해서 추가함
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
