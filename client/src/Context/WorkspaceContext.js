import React, { createContext, useState } from "react";

export const WorkspaceContext = createContext();

export const WorkspaceProvider = ({ children }) => {
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);

  return (
    <WorkspaceContext.Provider
      value={{ selectedWorkspace, setSelectedWorkspace }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};
