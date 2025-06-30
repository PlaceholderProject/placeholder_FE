import { useMutation } from "@tanstack/react-query";
import { getPresignedUrls, uploadImageToS3 } from "@/services/image.service"; // 경로는 실제 위치에 맞게 수정

/**
 * 여러 개의 이미지를 S3에 업로드하는 비동기 로직을 처리하는 useMutation 훅
 * @returns mutation 객체. `mutateAsync`를 호출하여 이미지 업로드를 실행할 수 있다.
 */
export const useImageUpload = () => {
  return useMutation({
    mutationFn: async ({ files, target }: { files: File[]; target: "user" | "meetup" | "schedule" }) => {
      if (files.length === 0) {
        return [];
      }

      // 1. 모든 파일의 고유한 MIME 타입을 추출
      const uniqueFileTypes = [...new Set(files.map(file => file.type))];

      // 2. 추출된 파일 타입들로 Pre-signed URL들을 한 번에 요청
      const presignedDataArray = await getPresignedUrls(uniqueFileTypes, target);

      // 3. 각 파일을 병렬로 S3에 업로드
      const uploadPromises = files.map(file => {
        // 현재 파일 타입에 맞는 Pre-signed URL 정보를 찾음
        const presignedData = presignedDataArray.find(data => data.fields["Content-Type"] === file.type);

        if (!presignedData) {
          throw new Error(`${file.type}에 대한 Pre-signed URL을 찾을 수 없습니다.`);
        }

        const { url, fields } = presignedData;
        return uploadImageToS3(url, fields, file);
      });

      // 4. 모든 업로드가 완료될 때까지 기다린 후, S3에 저장된 파일 key들의 배열을 반환
      const uploadedFileKeys = await Promise.all(uploadPromises);
      return uploadedFileKeys; // ['user/xxxx.png', 'user/yyyy.jpg'] 와 같은 배열이 반환됨
    },
    onSuccess: data => {
      console.log("모든 이미지 업로드 성공. S3 Keys:", data);
      // 이 곳에서 업로드 성공 후 로직을 추가할 수 있습니다. (예: 폼 상태 업데이트)
    },
    onError: error => {
      console.error("이미지 업로드 중 에러 발생:", error);
      alert("이미지 업로드에 실패했습니다. 다시 시도해주세요.");
    },
  });
};
