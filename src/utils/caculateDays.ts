import React from "react";

const caculateDays = ({ startedAt: number, EndedAt: number }) => {
  const numberOfDays = startedAt + EndedAt;
  return numberOfDays;
};

export default caculateDays;
