import Login from "@/components/auth/Login";
import Image from "next/image";
import React from "react";

const page = () => {
  return (
    <div className="flex h-[calc(100vh-7.5rem)] flex-row">
      <div className="relative hidden w-[50%] md:block">
        <Image src="/loginImage.png" alt="로그인사진" fill={true} style={{ objectFit: "cover" }}></Image>
      </div>
      <div className="w-full md:w-[50%] md:max-w-[55.5rem]">
        <Login />
      </div>
    </div>
  );
};

export default page;
