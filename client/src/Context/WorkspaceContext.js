import React, { createContext, useState, useCallback } from "react";

export const WorkspaceContext = createContext();

export const WorkspaceProvider = ({ children }) => {
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [workspaces, setWorkspaces] = useState([]);

  const handleSetSelectedWorkspace = useCallback((newWorkspace) => {
    console.log("Aktualisiere ausgewählten Workspace:", newWorkspace);
    // Fügen Sie hier ggf. Validierungen hinzu
    setSelectedWorkspace(newWorkspace);
  }, []); // Fügen Sie Abhängigkeiten hinzu, wenn nötig

  const handleSetWorkspaces = useCallback((newWorkspaces) => {
    console.log("Aktualisiere Workspaces Liste:", newWorkspaces);
    // Fügen Sie hier ggf. Validierungen hinzu
    setWorkspaces(newWorkspaces);
  }, []); // Fügen Sie Abhängigkeiten hinzu, wenn nötig

  const contextValue = {
    selectedWorkspace,
    setSelectedWorkspace: handleSetSelectedWorkspace,
    workspaces,
    setWorkspaces: handleSetWorkspaces,
  };

  return (
    <WorkspaceContext.Provider value={contextValue}>
      {children}
    </WorkspaceContext.Provider>
  );
};
