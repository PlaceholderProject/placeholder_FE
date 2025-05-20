export interface newReplyProps {
  text: string;
}

export interface ReplyItemProps {
  reply: Reply;
  allReplies: Reply[];
  meetupId: string | string[];
  scheduleId: string | string[];
}

export type Reply = {
  id: number;
  root: number | null;
  recipient: string;
  text: string;
  user: { image: string; nickname: string };
  createdAt: string;
  isOrganizer: boolean;
};
