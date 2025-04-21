// import React from "react";

// // import {
// //   // ...
// //   keepPreviousData,
// // } from '@tanstack/react-query';

// // const {
// //   data: postsData,
// //   isPending,
// //   isError,
// // } = useQuery({
// //     queryKey: ['posts', page],
// //     queryFn: () => getPosts(page, PAGE_LIMIT),
// //     placeholderData: keepPreviousData,
// // });

// const {
//   data: postsData,
//   isPending,
//   isError,
//   isPlaceholderData,
// } = useQuery({
//   queryKey: ["posts", page],
//   queryFn: () => getPosts(page, PAGE_LIMIT),
//   placeholderData: keepPreviousData,
// });

// // ...

// // return (
// //   ...
// //     <div>
// //     <ul>
// //       {posts.map((post) => (
// //         <li key={post.id}>{`${post.user.name}: ${post.content}`}</li>
// //       ))}
// //     </ul>
// //     <div>
// //       <button
// //         disabled={page === 0}
// //         onClick={() => setPage((old) => Math.max(old - 1, 0))}
// //       >
// //         &lt;
// //       </button>
// //       <button
// //         disabled={isPlaceholderData || !postsData?.hasMore}
// //         onClick={() => setPage((old) => old + 1)}
// //       >
// //         &gt;
// //       </button>
// //     </div>
// //   </div>

// // );

// // ...

// // useEffect(() => {
// //   if (!isPlaceholderData && postsData?.hasMore) {
// //     queryClient.prefetchQuery({
// //       queryKey: ['posts', page + 1],
// //       queryFn: () => getPosts(page + 1, PAGE_LIMIT),
// //     });
// //   }
// // }, [isPlaceholderData, postsData, queryClient, page]);
// // ...

// import { useState } from "react";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { getPosts, uploadPosts, getUserInfo } from "./api";

// const PAGE_LIMIT = 3;

// function HomePage() {
//   const [page, setPage] = useState(0);
//   const {
//     data: postData,
//     isPending,
//     isError,
//   } = useQuery({
//     queryKey: ["posts", page],
//     queryFn: () => getPosts(page, PAGE_LIMIT),
//   });

//   const posts = postsData?.results ?? [];

//   return (
//     <>
//       <div>
//         {currentUserName ? loginMessage : <button onClick={handleLoginButtonClick}>codeit으로 로그인</button>}
//         <form onSubmit={handleSubmit}>
//           <textarea name="content" value={content} onChage={handleInputChange} />
//           <button disabled={!content}>업로드</button>
//         </form>
//       </div>

//       <div>
//         <ul>
//           {posts.map(post => {
//             <li key={post.id}>
//               {post.user.name}: {post.content}
//             </li>;
//           })}
//         </ul>
//         <div>
//           <button disabled={page === 0} onClick={() => setPage(old => Math.max(old - 1, 0))}>
//             &lt;
//           </button>
//           <button disabled={!postsData?.hasMore} onClick={() => setPage(old => old + 1)}>
//             &gt;
//           </button>
//         </div>
//       </div>
//     </>
//   );
// }

// export default HomePage;

// const CurrentMyMeetup = () => {
//   const getCurrentMyMeetupsApi = () => {};
//   return <div>현재 내 모임 보기</div>;
// };

// // export async function getPosts(page = 0, limit = 10) {
// //   const response = await fetch(`${BASE_URL}/posts?page=${page}&limit={limit}`);
// //   return await response.json();
// // }

// export default CurrentMyMeetup;

"use client";

import React, { useState } from "react";
import RoleIcon from "./RoleIcon";
import { useQuery } from "@tanstack/react-query";
import MemberOutContainer from "./MemberOutContainer";
import { getMyMeetupsApi } from "@/services/my.space.service";
import Link from "next/link";

// 코드잇꺼에는 이게 왜 들어가지????? 그냥 상수로 넣어주고 쿼리에 쓰라고??
// const SIZE_LIMIT = 10;
const CurrentMyMeetup = () => {
  const [page, setPage] = useState(1);

  const {
    data: myMeetupsData,
    isPending,
    isError,
    error,
  } = useQuery({
    // --TO DO--
    // 쿼리키는 어쩐디?
    queryKey: ["myMeetups", "ongoing"],
    queryFn: () => getMyMeetupsApi("ongoing", page, 10),
  });

  if (isPending) return <div>로딩중...</div>;
  if (isError) return <div>에러 : {error.message}</div>;
  if (!myMeetupsData || myMeetupsData.length === 0) return <div>참여 중인 모임이 없습니다.</div>;

  return (
    <>
      <div className="grid grid-cols-1">
        {myMeetupsData.map(myMeetup => (
          // --TO DO--
          // 해당 Id 지도페이지로 이동하게 링크 바꿔야함
          <Link href="http://localhost:3000/" key={myMeetup.id} className="flex justify-between">
            <RoleIcon isOrganizer={myMeetup.is_organizer} />
            방장이니?: {`${myMeetup.is_organizer}`} 모임 이름:{myMeetup.name}
            <MemberOutContainer />
          </Link>
        ))}
      </div>
    </>
  );
};

export default CurrentMyMeetup;
