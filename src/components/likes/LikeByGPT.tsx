const likeMutation = useMutation({
  mutationFn: () => {
    const currentLike = queryClient.getQueryData<{ isLike: boolean }>(["likes", id])?.isLike ?? false;
    return toggleLikeApi(id, currentLike);
  },

  onMutate: async () => {
    const previousLikeData = queryClient.getQueryData(["likes", id]);
    const previousHeadhunting = queryClient.getQueryData(["headhuntings", id]);

    // ✅ 1. likes 쿼리가 없으면 초기화
    if (!previousLikeData) {
      const fallbackFromHeadhunting = queryClient.getQueryData<Meetup>(["headhuntings", id]);
      queryClient.setQueryData(["likes", id], {
        isLike: fallbackFromHeadhunting?.isLike ?? false,
        likeCount: fallbackFromHeadhunting?.likeCount ?? 0,
      });
    }

    // ✅ 2. 낙관적 업데이트: 최신 캐시 기준으로 변경
    queryClient.setQueryData(["likes", id], (old: any) => {
      const isLike = old?.isLike ?? false;
      const likeCount = old?.likeCount ?? 0;

      return {
        isLike: !isLike,
        likeCount: isLike ? likeCount - 1 : likeCount + 1,
      };
    });

    // ✅ 3. headhuntings 상세도 반영
    if (previousHeadhunting) {
      queryClient.setQueryData(["headhuntings", id], {
        ...previousHeadhunting,
        isLike: !previousHeadhunting.isLike,
        likeCount: previousHeadhunting.isLike ? (previousHeadhunting.likeCount ?? 1) - 1 : (previousHeadhunting.likeCount ?? 0) + 1,
      });
    }

    // ✅ 4. headhuntings 리스트도 반영
    const list = queryClient.getQueryData<Meetup[]>(["headhuntings"]);
    if (list) {
      queryClient.setQueryData(
        ["headhuntings"],
        list.map(item =>
          item.id === id
            ? {
                ...item,
                isLike: !item.isLike,
                likeCount: item.isLike ? (item.likeCount ?? 1) - 1 : (item.likeCount ?? 0) + 1,
              }
            : item,
        ),
      );
    }

    return { previousLikeData, previousHeadhunting };
  },

  onError: (err, _vars, context) => {
    if (context?.previousLikeData) {
      queryClient.setQueryData(["likes", id], context.previousLikeData);
    }
    if (context?.previousHeadhunting) {
      queryClient.setQueryData(["headhuntings", id], context.previousHeadhunting);
    }
  },

  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["likes", id] });
    queryClient.invalidateQueries({ queryKey: ["headhuntings", id] });
    queryClient.invalidateQueries({ queryKey: ["headhuntings"] });
  },
});
