import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/DashBoard/Dashboard";
import Video from "./components/Video";
import AuthContainer from "./components/Auth/AuthContainer";
import LandingPage from "./components/Landing/LandingPage";
import "./index.css";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthContainer />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/video" element={<Video />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
