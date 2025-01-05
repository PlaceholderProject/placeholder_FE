import AdButton from "@/components/ad/AdButton";
import AdClientSideWrapper from "@/components/ad/AdClientSideWrapper";
import AdDetail from "@/components/ad/AdDetail";
import AdSignboard from "@/components/ad/AdSignboard";
import AdUser from "@/components/ad/AdUser";

const AdPage = async ({ params }: { params: { meetupId: string } }) => {
  const resolvedParams = await params;
  const parsedMeetupId = parseInt(resolvedParams.meetupId, 10);

  return (
    <>
      <div>
        <AdSignboard meetupId={parsedMeetupId} />
        <AdUser meetupId={parsedMeetupId} />
        <AdDetail meetupId={parsedMeetupId} />
        <AdButton meetupId={parsedMeetupId} />
        <AdClientSideWrapper meetupId={parsedMeetupId}></AdClientSideWrapper>
      </div>
    </>
  );
};

export default AdPage;
