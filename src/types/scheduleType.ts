export interface Participant {
  nickname: string;
  image: string | null;
}

export interface Member {
  id: number;
  meetupId: number;
  user: {
    id: number;
    nickname: string;
    image: string;
  };
  role: string;
}

export interface Schedule {
  id: number;
  meetupId: number;
  scheduledAt: string;
  place: string;
  address: string;
  latitude: string;
  longitude: string;
  memo: string;
  image: string;
  participant: Participant[];
}
