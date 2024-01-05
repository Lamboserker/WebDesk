import React, { useEffect, lazy, Suspense, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthContainer from "./components/Auth/AuthContainer";
import LandingPage from "./components/Landing/LandingPage";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRouteDashboard";
import ProfileMenu from "./components/userProfile/ProfileMenu";
import {
  WorkspaceModalProvider,
  useWorkspaceModal,
} from "./Context/WorkspaceModalContext";
import { WorkspaceProvider } from "./Context/WorkspaceContext";
import Loading from "./components/Loading/Loading"; // Bestätigen Sie den Pfad zur Loading-Komponente
import { GoogleOAuthProvider } from "@react-oauth/google";
import { FullScreenProvider } from "./Context/FullscreenContext";
// Lazy loading for components
const Dashboard = lazy(() =>
  import("./components/DashBoard/components/Dashboard")
);
const VideoApp = lazy(() => import("./components/Video/VideoApp"));
const WorkspaceModal = lazy(() => import("./components/Modal/CreateWorkspaceModal"));

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Bestimmen Sie das Dunkle/Helle Thema
    checkDarkMode();

    // Setzen Sie isLoading nach 2 Sekunden auf false
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000);

    // Bereinigen Sie den Timer, wenn die Komponente unmountet wird
    return () => clearTimeout(timer);
  }, []);

  // Eine generische Ladekomponente für alle Pfade
  const loadingComponent = <Loading />;
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const renderLoading = () => {
    if (isLoading) {
      return <Loading />;
    }
    return null;
  };
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <WorkspaceProvider>
        <WorkspaceModalProvider>
          <FullScreenProvider>
            <div className="App">
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/auth" element={<AuthContainer />} />
                  <Route
                    path="/dashboard"
                    element={
                      <Suspense fallback={renderLoading()}>
                        <ProtectedRoute component={Dashboard} />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/videoapp"
                    element={
                      <Suspense fallback={renderLoading()}>
                        <VideoApp />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/create-workspace-modal"
                    element={<WorkspaceModalWrapper isLoading={isLoading} />}
                  />
                  <Route path="/my-profile" element={<ProfileMenu />} />
                </Routes>
              </BrowserRouter>
            </div>
          </FullScreenProvider>
        </WorkspaceModalProvider>
      </WorkspaceProvider>
    </GoogleOAuthProvider>
  );
}

function checkDarkMode() {
  const theme = localStorage.getItem("theme");
  document.body.classList.remove("dark", "light"); // Entfernen beider Klassen
  if (theme) {
    document.body.classList.add(theme); // Fügen Sie die entsprechende Klasse hinzu
  }
}

// Ein Wrapper-Komponent für WorkspaceModal, um den Kontext zu nutzen
const WorkspaceModalWrapper = ({ isLoading }) => {
  const { isModalOpen } = useWorkspaceModal();
  return (
    <Suspense fallback={isLoading ? <Loading /> : null}>
      {isModalOpen ? <WorkspaceModal /> : null}
    </Suspense>
  );
};

export default App;
