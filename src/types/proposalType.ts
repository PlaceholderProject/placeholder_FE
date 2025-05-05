export type SentProposal = {
  id: number;
  created_at: string;
  meetup_name: string;
  status: string;
  text: string;
};

export type ReceivedProposal = {
  id: number;
  status: string;
  text: string;
  user: { id: number; nickname: string; image: string };
};
