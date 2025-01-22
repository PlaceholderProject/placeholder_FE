export interface LikeAreaProps {
  isLike: boolean | undefined;
  likeCount: number | undefined;
  thumbnailId: number | undefined;
}

export interface LikeItemProps {
  isLike: boolean | undefined;
  likeCount: number | undefined;
  handleToggleLike: () => void;
}
