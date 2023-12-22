import React from "react";

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500"></div>
      <p className="text-lg text-blue-500 mt-4">Loading, please wait...</p>
    </div>
  );
};

export default Loading;
