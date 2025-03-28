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

import React from "react";
import MemberOutContainer from "./MemberOutContainer";
import RoleIcon from "./RoleIcon";

const CurrentMyMeetup = () => {
  return (
    <>
      <MemberOutContainer />
      <div>🐱현재 할리스강 6회 정기모임</div>
      <RoleIcon />
      <div>🐱현재 할리스강 6회 정기모임</div>
      <div>🐱현재 할리스강 6회 정기모임</div>
      <div>🐱현재 할리스강 6회 정기모임</div>
      <div>🐱현재 할리스강 6회 정기모임</div>
      <div>🐱현재 할리스강 6회 정기모임</div>
      <div>🐱현재 할리스강 6회 정기모임</div>
    </>
  );
};

export default CurrentMyMeetup;
