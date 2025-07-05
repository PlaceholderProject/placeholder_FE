import React from "react";

const Loading = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dimmer-900">
      <div className="h-16 w-16 animate-spin rounded-full border-b-4 border-t-4 border-primary"></div>
    </div>
  );
};

export default Loading;
