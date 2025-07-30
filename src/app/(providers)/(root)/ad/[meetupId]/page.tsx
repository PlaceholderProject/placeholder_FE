import { Metadata } from "next";
import ReplyArea from "@/components/common/reply/ReplyArea";
import AdArea from "@/components/ad/AdArea";
import { getMeetupByIdApi } from "@/services/meetup.service";

export async function generateMetadata({ params }: { params: Promise<{ meetupId: string }> }): Promise<Metadata> {
  const { meetupId } = await params;
  const meetup = await getMeetupByIdApi(Number(meetupId));

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

const AdPage = () => {
  return (
    <div>
      <AdArea />
      <ReplyArea />
    </div>
  );
};

export default AdPage;
