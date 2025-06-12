import Signup from "@/components/auth/Signup";
import Image from "next/image";
import React from "react";

const page = () => {
  return (
    <div className="flex h-[calc(100vh-12rem)] flex-row md:h-[calc(100vh-13.5rem)]">
      <div className="relative hidden w-[50%] md:block">
        <Image src="/signupImage.png" alt="회원가입사진" fill style={{ objectFit: "cover" }} />
      </div>
      <div className="w-full overflow-y-auto md:w-[50%]">
        <div className="w-full px-[4rem] py-[4rem]">
          <Signup />
        </div>
      </div>
    </div>
  );
};

export default page;
