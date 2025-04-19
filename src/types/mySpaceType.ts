export interface MyMeetup {
  id: number;
  is_organizer: boolean;
  name: string;
  ended_at: string;
  is_current: boolean;
}

export interface MyAd {
  id: number;
  ad_title: string;
  ad_ended_at: string;
  is_current: boolean;
}
