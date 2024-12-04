export interface LabeledInputProps {
  id: string;
  name: string;
  label: string;
  type?: string; // 인풋 타입 (기본값: "text")
  placeholder?: string; // 선택적 placeholder
  minlength?: string;
  maxlength?: string;
  required?: boolean;
  disabled?: boolean;
  checked?: boolean;
  accept?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}
