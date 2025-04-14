import { BASE_URL } from "@/constants/baseURL";
import { setReply } from "@/stores/replySlice";
import { ReplyItemProps } from "@/types/replyType";
import { transformCreatedDate } from "@/utils/ReplyDateFormat";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import NestedReplyItem from "./NestedReplyItem";

const ReplyItem: React.FC<ReplyItemProps> = ({ reply, allReplies }) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);

  const nestedReplies = allReplies.filter(r => r.root === reply.id);

  const createReply = () => {
    dispatch(setReply({ id: reply.id, recipient: reply.recipient, user: { nickname: reply.user.nickname, image: reply.user.image }, text: reply.text, createdAt: reply.createdAt }));
  };

  console.log(nestedReplies);

  return (
    <div className="m-2 text-[10px]">
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
        <span>{reply.user.nickname}✨</span>
        <span>{transformCreatedDate(reply.createdAt)}</span>
      </div>
      <div className="pl-6">{reply.text}</div>
      {user.email && (
        <button className="pl-6" onClick={createReply}>
          답글달기
        </button>
      )}
      {nestedReplies.length > 0 && nestedReplies.map(nestedReply => <NestedReplyItem key={nestedReply.id} nestedReply={nestedReply} />)}
    </div>
  );
};

export default ReplyItem;
