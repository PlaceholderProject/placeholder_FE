import {POSTS_PAGE_LIMIT} from './values';

const BASE_URL = 'https://learn.codeit.kr/api/codestudit';

export const getPosts = async (page = 0, limit = POSTS_PAGE_LIMIT) =>  {
  const respons = await fetch(`${BASE_URL}/posts?page=${page}&limit=${limit}`)
  return await respons.json();
}

export const getPostsByUserName = async (
  username,
  page = 0,
  limit = POSTS_PAGE_LIMIT
) => {
  const response = await fetch(
    `${BASE_URL}/posts?username=${username}&page=${page}&limit=${limit}`
  );

  return await response.json()

}

export const uploadPost(newPost) {
  const response = await fetch(`${BASE_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type' : 'application,json',
    },
    body: JSON.stringify(newPost)
  })
  if (!response.ok) {
    throw new Error('Failed to upload the post.');
  }

  return await response.json();
}

export async function getUserInfo(username) {
  const response = await fetch(`${BASE_URL}/users/${username}`);
  return await response.json();
}

export async function getCommentCountByPostId(postId) {
  const response = await fetch(`${BASE_URL}/posts/${postId}/comments`);
  const body = await response.json();
  return body.count;
}

export async function getCommentsByPostId(postId, page, limit) {
  const response = await fetch(
    `${BASE_URL}/posts/${postId}/comments?page=${page}&limit=${limit}`
  );
  return await response.json();
}

export async function addComment(postId, newComment) {
  const response = await fetch(`${BASE_URL}/posts/${postId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newComment),
  });

  if (!response.ok) {
    throw new Error('Failed to add the comment.');
  }
  return await response.json();
}

// 더 불러오기

import { useContext } from "react";
import { useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";


const PostList({variant = FEED_VARIANT.HOME_FEED, showPostForm}) => {
  const { currentUserName } = useContext(LoginContext);
  const queryClient = useQueryClient();

  let postsQueryKey;
  let postsQueryFn;

  if (variant === FEED_VARIANT.HOME_FEED) {
    postsQueryKey = [QUERY_KEYS.POSTS];
    postsQueryFn = ( {pageParam}) => getPosts(pageParam, POSTS_PAGE_LIMIT);
  } else if (variant === FEED_VARIANT.MY_FEED) {
    postsQueryKey = [QUERY_KEYS.POSTS, currentUserName];
    postsQueryFn = ({pageParam}) => {
      getPostsByUserName(currentUserName, pageParam, POSTS_PAGE_LIMIT);
    } else {
      console.warn('invalid feed request')
    }

    const {
      data: postsData,
      isPending,
      isError,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
    } = useInfiniteQuery({
      queryKey: postsQueryKey,
      queryFn: postsQueryFn,
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages, lastPageParam) => 
        lastPage.hasMore ? lastPageParam + 1 : undefined,
    });

    const uploadPostMutation = useMutation({
      mutationFn: (newPost) => uploadPostMutation(newPost),
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: [QUERY_KEYS.POSTS]});
      }
    });

    const handledUploadPost = (newPost) => {
      uploadPostMutation.mutate(newPost, {
        onSuccess: () => {
          toast('포스트 업로드 성공')
        }
      })

    }

    if (isPending) return <div>로딩중</div> 
    if (isError) return <div>에러발생</div>

    const postsPages = postsPages?.pages ?? [];


  }

  return (<>
  
  <div>
    {showPostForm ? (
      <PostForm 
      onSubmit = {handledUploadPost}
      buttonDisabled={uploadPostMutation.isPending}/>
      
    ) : (
      ''
    )}

    {postsPages.map((postPage) => 
    postPage.results.map((post) => <Post key={post.id} post={post}/>)
    
    )}

    <button onClick={fetchNextPage}
    disabled={!hasNextPage || isFetchingNextPage}>더 불러오기</button>
    </div></>)

}

export default PostList