export interface NewUserProps {
  email: string;
  password: string;
  nickname: string;
  bio: string | null;
}

export interface LoginProps {
  email: string;
  password: string;
}
