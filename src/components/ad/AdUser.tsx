"use client";

import React from "react";
import { getAccount } from "@/services/account.service";
import { useEffect } from "react";

const AdUser = () => {
  useEffect(() => {
    getAccount();
  }, []);
  return <div></div>;
};

export default AdUser;
