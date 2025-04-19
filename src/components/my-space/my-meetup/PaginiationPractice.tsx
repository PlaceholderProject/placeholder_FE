// import { React, useEffect, useState } from "react";
// import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
// import { BASE_URL } from "@/constants/baseURL";

import { BASE_URL } from "@/constants/baseURL";

// const async getCommentsByPostId(postId, page, limit) => {
//   const response = await fetch(
//     `${BASE_URL}/posts/${postId}/comments?page=${page}&limit=${limit}`
//   );
//   const body = await response.json();
//   return body;
// }
// const PaginiationPractice = ({currentUserName, postId}) => {
//   const [page, setPage] = useState(0);
//   const queryClient = useQueryClient();

//   const {
//     data: myMeetupsData,
//     isPending,
//     isPlaceholderData
//   } = useQuery ({
//     queryKey: [QUERY_KEYS.COMMENTS, postId, page],
//     queryFn : () => getCommentsByPostId(postId, page, COMMENTS_PAGE_LIMIT),
//     placeholderData: keepPreviousData,
//   })

//   const addCommentMutation = useMutation({
//     mutationFn: (newComment) => addComment(postId, newComment),
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.COMMENTS, postId],
//       });
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.COMMENT_COUNT, postId]

//       })
//     }
//   })

//   const handleAddComment = (newComment) => {
//     setPage(0);
//     addCommentMutation.mutate(newComment)
//   };

//   useEffect(() => {
//     if (!isPlaceholderData && commentsData?.hasMore) {
//       queryClient.prefetchQuery({
//         queryKey: [QUERY_KEYS.COMMENTS, postId, page + 1],
//         queryFn: () =>
//           getCommentsByPostId(postId, page + 1, COMMENTS_PAGE_LIMIT),
//       });
//     }
//   }, [isPlaceholderData, commentsData, queryClient, postId, page]);

//   if (isPending) return <div>로딩중입니다</div>

//   const comments = commentsData?.result ?? [];
//   const paginationButtons = (
//     <div>
//      <button disabled={page === 0}
//      onClick={() => setPage((old) => Math.max(old -1, 0))}>
//       &lt;
//      </button>
//      <button disabled={isPlaceholderData || !commentsData?.hasMore}
//      onClick={() => setPage((old) => old + 1)}>
//       &gt;
//      </button>
//     </div>
//   )

//   return (
//     <div>
//       <div>
//         {comments.map((comment) => {
//           <Comment key={comment.id} comment={comment} />
//         })}
//         {comments.length > 0 ? paginationButtons : ''}
//       </div>
//       <CommentForm
//       currentUserInfo={currentUserInfo>
//         onSubmit={handleAddComment}
//         buttonDisabled={addCommentMutation.isPending}
//         />

//     </div>
//   )
// }

// export default PaginiationPractice

// import { useState } from "react";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// export async getMyMeetups(page = 0, limit = 10) {
//   const response = await fetch(`${BASE_URL}/posts?page=${page}&limit=${limit}`);
//   return await response.json();
// }

// const PAGE_LIMIT = 5;

// const [page, setPage] = useState(0);
// const {
//   data: postsData,
//   isPending,
//   isError
// } = useQuery({
//   queryKey: ['headhuntings', page],
//   queryFn: () => getMyMeetups(page, PAGE_LIMIT)
// });

// const myMeetups = myMeetupsData?.results ?? [];

// return (
//   <>
//   <div>
//     {currentUsername ? (
//       loginMessage
//     ) : (
//       <button>

//       </button>
//     )}
//     </div></>
// )
