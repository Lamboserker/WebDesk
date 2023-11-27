import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/DashBoard/Dashboard";
import AuthContainer from "./components/Auth/AuthContainer";
import LandingPage from "./components/Landing/LandingPage";
import VideoApp from "./components/Video/VideoApp";
import WorkspaceModal from "./components/Modal/WorkspaceModal";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRouteDashboard";

function App() {
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);

  // Funktion zum Öffnen des Workspace-Modals
  const openWorkspaceModal = () => {
    setIsWorkspaceModalOpen(true);
  };

  
  const closeWorkspaceModal = () => {
    setIsWorkspaceModalOpen(false);
  };
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/auth"
            element={<AuthContainer onLoginSuccess={openWorkspaceModal} />}
          />
          <Route
            path="/dashboard"
            element={<ProtectedRoute component={Dashboard} />}
          />
          <Route path="/videoapp" element={<VideoApp />} />
          <Route
            path="/workspace-modal"
            element={
              isWorkspaceModalOpen ? (
                <WorkspaceModal onClose={closeWorkspaceModal} />
              ) : null
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
