// "use client";

// import AdButton from "@/components/ad/AdButton";
// import AdClientSideWrapper from "@/components/ad/AdClientSideWrapper";
// import AdDetail from "@/components/ad/AdDetail";
// import AdSignboard from "@/components/ad/AdSignboard";
// import AdOrganizer from "@/components/ad/AdOrganizer";

// const AdPage = ({ params }: { params: { meetupId: string } }) => {
//   const resolvedParams = params;
//   const parsedMeetupId = parseInt(resolvedParams.meetupId, 10);

//   return (
//     <>
//       <div>
//         <AdSignboard meetupId={parsedMeetupId} />
//         <AdOrganizer meetupId={parsedMeetupId} />
//         <AdDetail meetupId={parsedMeetupId} />
//         <AdButton meetupId={parsedMeetupId} />
//         <AdClientSideWrapper meetupId={parsedMeetupId}></AdClientSideWrapper>
//       </div>
//     </>
//   );
// };

// export default AdPage;

// "use client";

// import { use } from "react";
// import AdButton from "@/components/ad/AdButton";
// import AdClientSideWrapper from "@/components/ad/AdClientSideWrapper";
// import AdDetail from "@/components/ad/AdDetail";
// import AdSignboard from "@/components/ad/AdSignboard";
// import AdOrganizer from "@/components/ad/AdOrganizer";

// const AdPage = ({ params }: { params: { meetupId: string } }) => {
//   const resolvedParams = use(params); // params를 unwrap
//   const parsedMeetupId = parseInt(resolvedParams.meetupId, 10);

//   return (
//     <div>
//       <AdSignboard meetupId={parsedMeetupId} />
//       <AdOrganizer meetupId={parsedMeetupId} />
//       <AdDetail meetupId={parsedMeetupId} />
//       <AdButton meetupId={parsedMeetupId} />
//       <AdClientSideWrapper meetupId={parsedMeetupId} />
//     </div>
//   );
// };

// export default AdPage;

"use client";

import { use } from "react";
import AdButton from "@/components/ad/AdButton";
import AdClientSideWrapper from "@/components/ad/AdClientSideWrapper";
import AdDetail from "@/components/ad/AdDetail";
import AdSignboard from "@/components/ad/AdSignboard";
import AdOrganizer from "@/components/ad/AdOrganizer";

type PageParams = {
  meetupId: string;
};

const AdPage = ({ params }: { params: PageParams }) => {
  const resolvedParams = use<PageParams>(params);
  const parsedMeetupId = parseInt(resolvedParams.meetupId, 10);

  return (
    <div>
      <AdSignboard meetupId={parsedMeetupId} />
      <AdOrganizer meetupId={parsedMeetupId} />
      <AdDetail meetupId={parsedMeetupId} />
      <AdButton meetupId={parsedMeetupId} />
      <AdClientSideWrapper meetupId={parsedMeetupId} />
    </div>
  );
};

export default AdPage;

// "use client";

// import { use } from "react";
// import AdButton from "@/components/ad/AdButton";
// import AdClientSideWrapper from "@/components/ad/AdClientSideWrapper";
// import AdDetail from "@/components/ad/AdDetail";
// import AdSignboard from "@/components/ad/AdSignboard";
// import AdOrganizer from "@/components/ad/AdOrganizer";

// type PageParams = {
//   meetupId: string;
// };

// const AdPage = ({ params }: { params: PageParams }) => {
//   const resolvedParams = use(Promise.resolve(params));
//   const parsedMeetupId = parseInt(resolvedParams.meetupId, 10);

//   return (
//     <div>
//       <AdSignboard meetupId={parsedMeetupId} />
//       <AdOrganizer meetupId={parsedMeetupId} />
//       <AdDetail meetupId={parsedMeetupId} />
//       <AdButton meetupId={parsedMeetupId} />
//       <AdClientSideWrapper meetupId={parsedMeetupId} />
//     </div>
//   );
// };

// export default AdPage;
