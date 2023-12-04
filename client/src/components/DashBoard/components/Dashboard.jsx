import React, { useState, useEffect } from "react";
import axios from "axios";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import MainContent from "./Maincontent";

const Dashboard = () => {
  const [activeChannel, setActiveChannel] = useState(null);
  const [userData, setUserData] = useState({});
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  async function validateToken() {
    try {
      const response = await axios.get(
        "http://localhost:9000/api/users/validate-token",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      if (response.data.valid) {
        return response.data.userId;
      } else {
        throw new Error("Invalid token");
      }
    } catch (error) {
      console.error("Token validation error:", error);
      return null;
    }
  }

  // fetch current user information
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("userToken");
        const userId = await validateToken();
        const response = await axios.get("http://localhost:9000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
          params: { userId: userId },
        });
        setUserData({
          name: response.data.name,
          profileImage: response.data.profileImage,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleChannelChange = (channelId) => {
    setActiveChannel(channelId);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="dashboard-container">
      <Topbar userData={userData} toggleMenu={toggleMenu} />
      <div className="main-section">
        <Sidebar
          activeChannel={activeChannel}
          onChannelChange={handleChannelChange}
        />
        <MainContent activeChannel={activeChannel} />
      </div>
    </div>
  );
};

export default Dashboard;
