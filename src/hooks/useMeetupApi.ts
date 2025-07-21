//meetup.service.ts의 api를 훅으로 래핑만 한다

import { createMeetupApi, editMeetupApi, getMeetupByIdApi, getMeetupPresignedUrl } from "@/services/meetup.service";
import { FileType, Meetup, NewMeetup, S3PresignedItem } from "@/types/meetupType";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

//모임 생성
export const useCreateMeetup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, imageUrl }: { data: NewMeetup; imageUrl: string }) => createMeetupApi(data, imageUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meetups"] }), queryClient.invalidateQueries({ queryKey: ["headhuntings"] });
    },
  });
};

//모임 수정
export const useEditMeetup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, imageUrl, meetupId }: { data: Meetup; imageUrl: string; meetupId: number }) => editMeetupApi(data, imageUrl, meetupId),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ["meetup", variables.meetupId] });
      queryClient.invalidateQueries({ queryKey: ["meetups"] });
    },
  });
};

//모임 조회
export const useMeetupDetail = (meetupId?: number, options?: { enabled: boolean }) => {
  return useQuery({
    queryKey: ["meetup", meetupId],
    queryFn: () => getMeetupByIdApi(meetupId!),
    enabled: options?.enabled !== undefined ? options?.enabled : !!meetupId,
  });
};

//S3 presigned url 가져오기
export const useGetPresignedUrl = () => {
  return useMutation({
    mutationFn: (fileType: FileType) => getMeetupPresignedUrl(fileType),
  });
};

//s3에 직접 업로드 (기존 meetupUploadToS3로직)

export const useS3Upload = () => {
  return useMutation({
    mutationFn: async ({ file, presignedData }: { file: File; presignedData: S3PresignedItem }) => {
      const formData = new FormData();

      // presignedURL의 필드들을 FormData에 추가
      Object.keys(presignedData.fields).forEach(key => {
        formData.append(key, presignedData.fields[key as keyof typeof presignedData.fields]);
      });

      formData.append("file", file);

      const response = await fetch(presignedData.url, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`S3 업로드 실패: ${response.status} ${errorText}`);
      }

      //업로드된 파일 URL 반환
      return `${presignedData.url}${presignedData.fields.key}`;
    },
  });
};
