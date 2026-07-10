import { Metadata } from "next";
import ReplyArea from "@/components/common/reply/ReplyArea";
import AdArea from "@/components/ad/AdArea";
import { getMeetupByIdApi } from "@/services/meetup.service";
import { isNotFoundError } from "@/utils/httpError";
import { parsePositiveInteger } from "@/utils/parsePositiveInteger";
import { notFound } from "next/navigation";

const getMeetupOrNotFound = async (value: string) => {
  const meetupId = parsePositiveInteger(value);
  if (!meetupId) notFound();

  try {
    return { meetupId, meetup: await getMeetupByIdApi(meetupId) };
  } catch (error) {
    if (isNotFoundError(error)) notFound();
    throw error;
  }
};

export async function generateMetadata({ params }: { params: Promise<{ meetupId: string }> }): Promise<Metadata> {
  const { meetupId } = await params;
  const { meetup } = await getMeetupOrNotFound(meetupId);

  return {
    title: meetup.adTitle ?? "Placeholder - 광고 상세",
    description: meetup.description ?? "Placeholder 광고 상세 페이지",
    openGraph: {
      title: meetup.adTitle,
      description: meetup.description,
      url: `https://place-holder.site/ad/${meetupId}`,
      images: [
        {
          url: meetup.image ?? "https://place-holder.site/logoImage.png",
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meetup.adTitle,
      description: meetup.description,
      images: [meetup.image],
    },
  };
}

const AdPage = async ({ params }: { params: Promise<{ meetupId: string }> }) => {
  const { meetupId: meetupIdParam } = await params;
  const { meetupId, meetup } = await getMeetupOrNotFound(meetupIdParam);

  return (
    <AdArea initialData={meetup} meetupId={meetupId}>
      <ReplyArea variant="card" />
    </AdArea>
  );
};
export default AdPage;
