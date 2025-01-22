"use client";

import React from "react";

import ThumbnailArea from "@/components/thumbnails/ThumbnailArea";

const token = process.env.NEXT_PUBLIC_MY_TOKEN;

const MainPage = () => {
  return (
    <>
      <div>
        <ThumbnailArea />
      </div>
    </>
  );
};

export default MainPage;
