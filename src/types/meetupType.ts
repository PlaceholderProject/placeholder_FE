export interface Meetup {
  name: string;
  description: string;
  place: string;
  placeDescription: string;
  startedAt: string | null;
  endedAt: string | null;
  adTitle: string;
  adEndedAt: string | null;
  isPublic: boolean;
  image: string;
  category: string;
}
export interface LabeledInputProps {
  id: string;
  name: string;
  label: string;
  type?: string; // 인풋 타입 (기본값: "text")
  placeholder?: string; // 선택적 placeholder
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
}
