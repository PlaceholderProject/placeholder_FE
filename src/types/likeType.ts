import { Meetup } from "./meetupType";

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
