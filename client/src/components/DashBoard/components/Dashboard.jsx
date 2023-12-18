import React, { useState, useContext } from "react";
import Sidebar from "./Sidebar";
import MainContent from "./Maincontent";
import MemberSidebar from "./MemberSidebar";
import { WorkspaceContext } from "../../../Context/WorkspaceContext";
const Dashboard = () => {
  const [activeChannel, setActiveChannel] = useState(null);
  const { selectedWorkspace } = useContext(WorkspaceContext);
  return (
    <div className="flex h-screen  bg-luckyPoint-100 dark:bg-sidebarblue-200">
      <div className="h-full">
        <Sidebar
          activeChannel={activeChannel}
          setActiveChannel={setActiveChannel}
        />
      </div>
      <div className="flex flex-col flex-1 h-full bg-luckyPoint-200 dark:bg-luckyPoint-800">
        <MainContent activeChannel={activeChannel} />
      </div>
      <MemberSidebar />
      {/* Fügen Sie die WorkspaceMembers Komponente hinzu */}
    </div>
  );
};

export default Dashboard;
