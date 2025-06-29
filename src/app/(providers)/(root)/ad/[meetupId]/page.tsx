"use client";

import ReplyArea from "@/components/common/reply/ReplyArea";
import { useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import { useParams } from "next/navigation";
import AdArea from "@/components/ad/AdArea";

const AdPage = () => {
  return (
    <div>
      <AdArea />

      <ReplyArea />
    </div>
  );
};

export default AdPage;
