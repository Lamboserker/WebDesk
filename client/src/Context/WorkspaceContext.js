import React, { createContext, useState } from "react";

export const WorkspaceContext = createContext();

export const WorkspaceProvider = ({ children }) => {
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [workspaces, setWorkspaces] = useState([]); // Hinzufügen eines Zustands für die Workspaces

  // function and states, to hand over the workspaces to the children components
  const contextValue = {
    selectedWorkspace,
    setSelectedWorkspace,
    workspaces,
    setWorkspaces, 
  };

  return (
    <WorkspaceContext.Provider value={contextValue}>
      {children}
    </WorkspaceContext.Provider>
  );
};
