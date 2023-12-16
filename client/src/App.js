import React, {useEffect} from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/DashBoard/components/Dashboard";
import AuthContainer from "./components/Auth/AuthContainer";
import LandingPage from "./components/Landing/LandingPage";
import VideoApp from "./components/Video/VideoApp";
import WorkspaceModal from "./components/Modal/WorkspaceModal";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRouteDashboard";
import ProfileMenu from "./components/userProfile/ProfileMenu";
import {
  WorkspaceModalProvider,
  useWorkspaceModal,
} from "./Context/WorkspaceModalContext";
import { WorkspaceProvider } from "./Context/WorkspaceContext";

function App() {

  useEffect (() => {
  const checkDarkMode = () => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      return document.body.classList.toggle("dark");
    } else if (theme === "light") {
      return document.body.classList.toggle("light");
    }
  };
  checkDarkMode();
}, []);
  return (
    <WorkspaceProvider>
      <WorkspaceModalProvider>
        <div className="App">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthContainer />} />
              <Route
                path="/dashboard"
                element={<ProtectedRoute component={Dashboard} />}
              />
              <Route path="/videoapp" element={<VideoApp />} />
              <Route
                path="/workspace-modal"
                element={<WorkspaceModalWrapper />}
              />

              <Route path="/my-profile" element={<ProfileMenu />} />
            </Routes>
          </BrowserRouter>
        </div>
      </WorkspaceModalProvider>
    </WorkspaceProvider>
  );
}
// A wrapper component for WorkspaceModal to use the context
const WorkspaceModalWrapper = () => {
  const { isModalOpen } = useWorkspaceModal();

  return isModalOpen ? <WorkspaceModal /> : null;
};

export default App;
