import React from "react";

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-luckyPoint-900">
      <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-luckyPoint-50"></div>
      <p className="text-lg text-luckyPoint-50 mt-4 ml-5">
        Loading, please wait...
      </p>
    </div>
  );
};

export default Loading;
