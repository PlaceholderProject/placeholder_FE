export interface MyMeetupUser {
  id: number;
  nickname: string;
  image: string;
}

export interface MyMeetupMember {
  id: number;
  meetupId: number;
  user: MyMeetupUser;
  role: string;
}

export interface MyMeetupMembersResponse {
  result: MyMeetupMember[];
}

export interface MyMeetupMembersProps {
  meetupId: number;
}

export interface MeetupMemberProps {
  member_id: number;
}
