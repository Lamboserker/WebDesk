import React, { createContext, useState, useContext } from "react";

// Schritt 1: Erstellen des Context
export const SidebarContext = createContext();

export const useSidebar = () => {
  return useContext(SidebarContext);
};

export const SidebarProvider = ({ children }) => {
  // Schritt 2: Zustand und Zustandsaktualisierungsfunktion
  const [selectedMenuItem, setSelectedMenuItem] = useState("");

  // Funktion, um den ausgewählten Menüpunkt zu aktualisieren
  const updateSelectedMenuItem = (menuItem) => {
    setSelectedMenuItem(menuItem);
  };

  return (
    <SidebarContext.Provider
      value={{ selectedMenuItem, updateSelectedMenuItem }}
    >
      {children}
    </SidebarContext.Provider>
  );
};
