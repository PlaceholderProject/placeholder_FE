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

// 멤버 프로필 정보
export interface MemberProfile extends Member {
  nickname: string;
  profileImage: string | null;
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
  image?: string;
  participant: Participant[];
}