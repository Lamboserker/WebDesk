import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/DashBoard/Dashboard";
import AuthContainer from "./components/Auth/AuthContainer";
import LandingPage from "./components/Landing/LandingPage";
import VideoApp from "./components/Video/VideoApp";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthContainer />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/videoapp" element={<VideoApp />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
