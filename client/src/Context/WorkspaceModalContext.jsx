import React, { createContext, useState, useContext } from 'react';

// Create the context
const WorkspaceModalContext = createContext();

// Export a hook to use the context
export const useWorkspaceModal = () => useContext(WorkspaceModalContext);

// Provider Component
export const WorkspaceModalProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <WorkspaceModalContext.Provider value={{ isModalOpen, openModal, closeModal }}>
      {children}
    </WorkspaceModalContext.Provider>
  );
};
