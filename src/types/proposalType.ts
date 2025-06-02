export type SentProposal = {
  id: number;
  created_at: string;
  meetup_name: string;
  meetup_ad_title: string;
  status: string;
  text: string;
};

export type ReceivedProposal = {
  id: number;
  status: string;
  text: string;
  user: { id: number; nickname: string; image: string };
};

export type OrganizedMeetup = {
  ended_at: string;
  id: number;
  is_current: boolean;
  is_organizer: boolean;
  name: string;
};
