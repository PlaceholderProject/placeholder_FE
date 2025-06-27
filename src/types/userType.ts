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

export interface PresignedUrlProps {
  url: string;
  fields: PresignedUrlFields;
}

type PresignedUrlFields = {
  "Content-Type": string;
  success_action_status: string;
  key: string;
  "x-amz-algorithm": string;
  "x-amz-credential": string;
  "x-amz-date": string;
  policy: string;
  "x-amz-signature": string;
};
