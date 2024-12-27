// "use client";

// import AdButton from "@/components/ad/AdButton";
// import AdDetail from "@/components/ad/AdDetail";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { useParams } from "next/navigation";
// import React from "react";

// const queryClient = new QueryClient();

// const AdPage = () => {
//   const { meetupId } = useParams<{ meetupId: string }>();

//   return (
//     <>
//       <h2>페이지는 CSR, AdDetail은 SSR 할거예욥 </h2>
//       <p>디테일이야</p>
//       <QueryClientProvider client={queryClient}>{meetupId && <AdDetail meetupId={parseInt(meetupId, 10)} />}</QueryClientProvider>
//       <div></div>

//       <AdButton />
//     </>
//   );
// };

// export default AdPage;

// const AdPage = async ({ params }: { params: { meetupId: string } }) => {
//   const meetupId = await params.meetupId;

//   return (
//     <>
//       <div>
//         <AdDetail meetupId={parseInt(meetupId, 10)} />
//         <AdClientSideWrapper meetupId={parseInt(meetupId, 10)} />
//       </div>
//     </>
//   );
// };

// export default AdPage;

// 위 코드는 여전히 `page.tsx:32  Server   Error: Route "/ad/[meetupId]" used `params.meetupId`. `params` should be awaited before using its properties.` 오류가 뜨지만, 수정 전 한 번의 새로 고침에 2번이 뜨던 것과 달리 1번만 뜬다.

import AdClientSideWrapper from "@/components/ad/AdClientSideWrapper";
import AdDetail from "@/components/ad/AdDetail";

const AdPage = async ({ params }: { params: { meetupId: string } }) => {
  const resolvedParams = await params;

  return (
    <>
      <div>
        <AdDetail meetupId={parseInt(resolvedParams.meetupId, 10)} />
        <AdClientSideWrapper meetupId={parseInt(resolvedParams.meetupId, 10)} />
      </div>
    </>
  );
};

export default AdPage;
