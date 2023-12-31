import React, { createContext, useState, useEffect } from "react";

// Erstellen des Kontexts
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // oder ein geeigneter Anfangswert

  // Funktion zum Einloggen des Benutzers
  const loginUser = (userData) => {
    // Hier könnten Sie mit einem Backend kommunizieren, um den Benutzer zu authentifizieren
    setUser(userData);
    // Speichern des Login-Status im localStorage oder in einer ähnlichen Persistenzschicht
    localStorage.setItem("isLoggedIn", "true");
  };

  // Funktion zum Ausloggen des Benutzers
  const logoutUser = () => {
    setUser(null);
    localStorage.setItem("isLoggedIn", "false");
  };

  // Effekt, der beim Initialisieren der App den Login-Status überprüft
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (isLoggedIn) {
      // Hier könnten Sie Nutzerdaten vom Backend abrufen oder ähnliches
      setUser({
        /* Nutzerdaten */
      });
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};
