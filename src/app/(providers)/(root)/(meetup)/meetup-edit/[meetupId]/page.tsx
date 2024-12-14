import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MeetupEditForm from "@/components/meetup/MeetupEditForm";

const queryClient = new QueryClient();

const MeetupEditPage = ({ params }: { params: { meetupId: string } }) => (
  <>
    <QueryClientProvider client={queryClient}>
      <MeetupEditForm meetupId={Number(params.meetupId)} />
    </QueryClientProvider>
  </>
);

export default MeetupEditPage;
