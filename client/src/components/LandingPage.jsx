import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles/LandingPage.css";

const LandingPage = () => {
    const navigate = useNavigate();


    const start = () => {
        navigate("/auth");
    };
  return (
    <div className="main1">
      {/* Header Section */}
      <div className="header">
        <h1 className="h1">Welcome to WebDesk!</h1>
        <p className="p">Discover the future of co-working</p>
        <button onClick={start} className="button1">get started</button>
      </div>

      {/* Main Content */}
      <div className="content">
        {/* Inhalt des Hauptbereichs hier einfügen */}
      </div>
    </div>
  );
};

export default LandingPage;
