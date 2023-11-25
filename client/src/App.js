import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './components/DashBoard/Dashboard';
import AuthContainer from './components/Auth/AuthContainer';
import LandingPage from './components/Landing/LandingPage';
import VideoApp from './components/Video/VideoApp';
import WorkspaceModal from './components/Modal/WorkspaceModal';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRouteDashboard'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthContainer />} />
          <Route path="/dashboard" element={<ProtectedRoute component={Dashboard} />} />
          <Route path="/videoapp" element={<VideoApp />} />
          <Route path="/workspace-modal" element={<WorkspaceModal />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;