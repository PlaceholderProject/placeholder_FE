export interface Meetup {
  name: string;
  description: string;
  place: string;
  placeDescription: string;
  startedAt: string | null;
  endedAt: string | null;
  adTitle: string;
  adEndedAt: string | null;
  isPublic: boolean;
  // image: string;
  category: string;
}
