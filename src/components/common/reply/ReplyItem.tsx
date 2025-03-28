import { BASE_URL } from "@/constants/baseURL";
import { ReplyItemProps } from "@/types/replyType";
import Image from "next/image";

const ReplyItem: React.FC<ReplyItemProps> = ({ reply }) => {
  return (
    <div className="bg-slate-100 m-2 text-[10px]">
      <div className="flex flex-row gap-1 items-center">
        <div className="w-[15px] h-[15px] rounded-full overflow-hidden">
          <Image
            src={reply.user.image ? (reply.user.image.startsWith("http") ? reply.user.image : `${BASE_URL}${reply.user.image}`) : "/profile.png"}
            alt="프로필 이미지"
            width="15"
            height="15"
            unoptimized={true}
          />
        </div>
        <span>{reply.user.nickname}</span>
        <span>{reply.createdAt}</span>
      </div>
      <div className="pl-6">{reply.text}</div>
    </div>
  );
};

export default ReplyItem;
