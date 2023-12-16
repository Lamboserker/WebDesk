import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import MainContent from "./Maincontent";

const Dashboard = () => {
  const [activeChannel, setActiveChannel] = useState(null);

  return (
    <div className="flex h-screen bg-luckyPoint-100 dark:bg-sidebarblue-200">
      <div className="h-full">
        <Sidebar
          activeChannel={activeChannel}
          setActiveChannel={setActiveChannel}
        />
      </div>
      <div className="flex flex-col flex-1 h-full bg-luckyPoint-200 dark:bg-luckyPoint-800">
        <MainContent activeChannel={activeChannel} />
      </div>
    </div>
  );
};

export default Dashboard;
