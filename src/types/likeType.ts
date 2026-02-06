import { Meetup } from "./meetupType";
export interface PageData {
  result: Meetup[];
  total: number;
  previous: string | null;
  next: string | null;
}

export interface LikeItemProps {
  isLike: boolean;
  likeCount: number;
  onToggle: () => void;
  isPending: boolean;
  disabled?: boolean;
}

export interface LikeContainerProps {
  id: Meetup["id"];
  initialIsLike: boolean;
  initialLikeCount: number;
}
