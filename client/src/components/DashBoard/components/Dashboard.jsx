import React, { useState } from "react";
import Sidebar from "./Sidebar";
import MainContent from "./Maincontent";
import MemberSidebar from "./MemberSidebar";

const Dashboard = () => {
  const [activeChannel, setActiveChannel] = useState(null);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="h-full bg-luckyPoint-200 dark:bg-sidebarblue-200">
        <Sidebar
          activeChannel={activeChannel}
          setActiveChannel={setActiveChannel}
        />
      </div>

      {/* Hauptbereich für den Inhalt */}
      <div className="flex flex-col flex-1 h-screen overflow-x-hidden">
        {/* Verwende max-w-screen-xl, um die Breite auf den Bildschirm plus Padding zu begrenzen */}
        <div className="max-w-screen flex flex-col flex-1 h-screen  bg-luckyPoint-200 dark:bg-luckyPoint-800">
          <MainContent activeChannel={activeChannel} />
        </div>
      </div>

      {/* MemberSidebar */}
      <MemberSidebar />
    </div>
  );
};

export default Dashboard;
