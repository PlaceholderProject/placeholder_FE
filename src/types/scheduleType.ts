export interface Schedule {
  id: number;
  meetup_id: number;
  scheduled_at: string;
  place: string;
  address: string;
  latitude: number;
  longitude: number;
  memo: string;
  image?: string;
  created_at?: string;
  updated_at?: string;
  participant: string[];
}
