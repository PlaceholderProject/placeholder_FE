"use client";

import React, { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");

  const handleEmail = e => {
    setEmail(e.target.value);
  };

  return (
    <div className="flex flex-col">
      <h2>로그인페이지</h2>
      <div className="border-[#CFCFCF] border-2 w-10/12">
        <form onSubmit={() => {}}>
          <div>
            <div>이메일 주소</div>
            <input className="border-2 rounded-md" onChange={e => handleEmail(e)} />
          </div>
          <div>
            <div>비밀번호</div>
            <input className="border-2 rounded-md" />
          </div>
          <button className="bg-slate-300">로그인</button>
        </form>
        <button className="bg-slate-100" onClick={() => {}}>
          회원가입
        </button>
      </div>
    </div>
  );
};

export default Login;
