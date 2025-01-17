export interface EditedUserProps {
  profileImage: File | null;
  nickname: string;
  bio: string;
}

export type User = {
  email: string;
  nickname: string;
  bio: string;
  image: string;
};
