import { useMutation } from "@tanstack/react-query";
import { getPresignedUrls, uploadImageToS3 } from "@/services/image.service";


export const useImageUpload = () => {
  return useMutation({
    mutationFn: async ({ files, target }: { files: File[]; target: "user" | "meetup" | "schedule" }) => {
      if (files.length === 0) {
        return [];
      }
      const uniqueFileTypes = [...new Set(files.map(file => file.type))];
      const presignedDataArray = await getPresignedUrls(uniqueFileTypes, target);
      const uploadPromises = files.map(file => {
        const presignedData = presignedDataArray.find(data => data.fields["Content-Type"] === file.type);

        if (!presignedData) {
          throw new Error(`${file.type}에 대한 Pre-signed URL을 찾을 수 없습니다.`);
        }

        const { url, fields } = presignedData;
        return uploadImageToS3(url, fields, file);
      });
      const uploadedFileKeys = await Promise.all(uploadPromises);
      return uploadedFileKeys;
    },
    onSuccess: data => {
    },
    onError: error => {
      console.error("이미지 업로드 중 에러 발생:", error);
      toast.error("이미지 업로드에 실패했습니다. 다시 시도해주세요.");
    },
  });
};
