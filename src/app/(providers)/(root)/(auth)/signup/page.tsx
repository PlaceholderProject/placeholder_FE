import Signup from "@/components/auth/Signup";
import Image from "next/image";
import React from "react";

const page = () => {
  return (
    <div className="flex h-[calc(100vh-13rem)] flex-row">
      <div className="relative hidden w-[50%] md:block">
        <Image src="/signupImage.png" alt="회원가입사진" fill style={{ objectFit: "cover" }} />
      </div>
      <div className="w-full overflow-y-auto md:w-[50%]">
        <div className="min-h-screen w-full px-4 py-[4rem] md:max-w-[55.5rem]">
          <Signup />
        </div>
      </div>
    </div>
  );
};

export default page;
