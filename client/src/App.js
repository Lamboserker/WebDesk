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
import { SidebarProvider } from "./Context/SidebarContext";
import { WorkspaceProvider } from "./Context/WorkspaceContext";
import Loading from "./components/Loading/Loading"; // Bestätigen Sie den Pfad zur Loading-Komponente
import { GoogleOAuthProvider } from "@react-oauth/google";
import { FullScreenProvider } from "./Context/FullscreenContext";
import NotFound from "./components/NotFound/NotFound";
import Sidebar from "./components/userProfile/components/Sidebar";
import { AuthProvider } from "./Context/AuthContext";
const Dashboard = lazy(() =>
  import("./components/DashBoard/components/Dashboard")
);
const VideoApp = lazy(() => import("./components/Video/VideoApp"));
const WorkspaceModal = lazy(() =>
  import("./components/Modal/CreateWorkspaceModal")
);

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkDarkMode();

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

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
      <AuthProvider>
        <WorkspaceProvider>
          <WorkspaceModalProvider>
            <FullScreenProvider>
              <SidebarProvider>
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
                        element={
                          <WorkspaceModalWrapper isLoading={isLoading} />
                        }
                      />

                      <Route path="/profile-form" element={<ProfileMenu />} />

                      <Route
                        path="/account-settings"
                        element={<ProfileMenu />}
                      />
                      <Route path="/notifications" element={<ProfileMenu />} />
                      <Route path="pro-account" element={<ProfileMenu />} />

                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </BrowserRouter>
                </div>
              </SidebarProvider>
            </FullScreenProvider>
          </WorkspaceModalProvider>
        </WorkspaceProvider>
      </AuthProvider>
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
