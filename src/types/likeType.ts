import { Meetup } from "./meetupType";

// API 응답 페이지 데이터 타입
export interface PageData {
  result: Meetup[];
  total: number;
  previous: string | null;
  next: string | null;
}

export interface LikePartProps {
  isLike: boolean;
  likeCount: number;
  onToggle: () => void;
  isPending?: boolean;
}

export interface LikeItemProps {
  isLike: boolean;
  likeCount: number;
  onClick: () => void;
  disabled?: boolean;
}

export interface LikeContainerProps {
  id: Meetup["id"];
  initialIsLike: boolean;
  initialLikeCount: number;
}

// export interface LikeContainerProps {
//   id: number;
//   // type?: "headhungting";
// }
