export interface newReplyProps {
  text: string;
}

export interface ReplyItemProps {
  reply: Reply;
}

export type Reply = {
  id: number;
  recipient: string;
  text: string;
  user: { image: string; nickname: string };
  createdAt: string;
};
