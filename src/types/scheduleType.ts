export interface Schedule {
  id: number;
  meetup_id: number;
  scheduled_at: string;
  place: string;
  address: string;
  latitude: string;
  longitude: string;
  memo: string;
  image?: string;
  participant: Array<{
    nickname: string;
    image: string | null;
  }>;
}
