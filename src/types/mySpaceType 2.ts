export interface MyMeetupsResponse {
  result: MyMeetupItem[];
  total: number;
  previous: string | null;
  next: string | null;
}

export interface MyMeetupItem {
  id: number;
  is_organizer: boolean;
  name: string;
  ended_at: string;
  is_current: boolean;
  total: number;
}

export interface MyAdsResponse {
  result: MyAdItem[];
  total: number;
  previous: string | null;
  next: string | null;
}

export interface MyAdItem {
  id: number;
  ad_title: string;
  ad_ended_at: string;
  is_current: boolean;
  total: number;
}
