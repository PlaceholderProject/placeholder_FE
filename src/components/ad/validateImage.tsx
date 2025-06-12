import { BASE_URL } from "@/constants/baseURL";

// 프로필 이미지 없는 경우나 절대 경로 or 상대 경로에 따라 이미지 src 설정

interface ValidateImagePropsType {
  data: any;
  personKey: string; //'organizer', 'user' 같은거
  imageKey: string; // 'profileImage', 'iamge'...
  setImageSource: (source: string) => void;
  fallbackImage: string;
}

export const validateImage = ({ data, personKey, imageKey, setImageSource, fallbackImage = "profile.png" }: ValidateImagePropsType): (() => void) => {
  const imagePath = data?.[personKey]?.[imageKey];

  if (!data || !imagePath) {
    setImageSource(fallbackImage);
    return () => {};
  }

  // 절대경로인지 확인해 url 생성

  const imageUrl = imagePath.startsWith("http") ? imagePath : `${BASE_URL}${imagePath}`;

  // 이미지 요소 생성해 로드 테슬트
  const imgElement = document.createElement("img");
  imgElement.onload = () => {
    setImageSource(imageUrl);
  };

  imgElement.onerror = () => {
    setImageSource(fallbackImage);
  };

  imgElement.src = imageUrl;

  // 클린업 함수 반환
  return () => {
    if (imgElement) {
      imgElement.onload = null;
      imgElement.onerror = null;
      imgElement.src = "";
    }
  };
};
