export type SearchedType = {
  adEndedAt: string;
  adTitle: string;
  commentCount: number;
  createdAt: string;
  endedAt: string;
  id: number;
  image: string;
  isLike: boolean;
  isOrganizer: boolean;
  isPublic: boolean;
  likeCount: number;
  meetup: string;
  organizer: { nickname: string; profileImage: string | null };
  place: string;
  startedAt: string;
};
