export interface LikeAreaProps {
  isLike: boolean | undefined;
  likeCount: number | undefined;
  onToggle: () => void;
  isPending?: boolean;
}

export interface LikeItemProps {
  isLike: boolean | undefined;
  likeCount: number | undefined;
  onClick: () => void;
  disabled?: boolean;
}

export interface LikeContainerProps {
  id: number;
  // type?: "headhungting";
}
