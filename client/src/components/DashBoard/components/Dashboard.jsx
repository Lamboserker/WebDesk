import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import MainContent from "./Maincontent";

const Dashboard = () => {
  const [activeChannel, setActiveChannel] = useState(null);

  return (
    <div className="flex h-screen bg-gradient-to-r from-gray-100 via-purple-900 to-gray-100 dark:bg-gradient-to-r dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
      <div className="main-section">
        <Sidebar
          activeChannel={activeChannel}
          setActiveChannel={setActiveChannel}
        />
      </div>
      <div className="flex flex-col flex-1 h-screen">
        <MainContent activeChannel={activeChannel} />
      </div>
    </div>
  );
};

export default Dashboard;
