interface Meetup {
  id: number;
  isOrganizer: boolean;
  organizer: {
    name: string;
    profileImage: string;
  };
  name: string;
  description: string;
  place: string;
  startedAt: string | null;
  endedAt: string | null;
  adTitle: string;
  adEndedAt: string | null;
  isPublic: boolean; 
  image: string;
  category: string;

}