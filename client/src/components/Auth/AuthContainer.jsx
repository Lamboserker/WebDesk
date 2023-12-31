import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import "../styles/authstyles.css";

const AuthContainer = ({ onLoginSuccess }) => {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Überprüfe, ob der Query-Parameter 'register' auf 'true' gesetzt ist
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get("register") === "true") {
      setIsRightPanelActive(true);
    }
  }, [location]); // Führe dies aus, wenn sich die URL ändert

  return (
    <div className="myApp-body">
      <div
        className={`myApp-container ${
          isRightPanelActive ? "right-panel-active" : ""
        }`}
        id="container"
      >
        <SignUp />
        <SignIn onLoginSuccess={onLoginSuccess} />
        <div className="myApp-overlay-container">
          <div className="myApp-overlay">
            <div className="myApp-overlay-panel myApp-overlay-left">
              <h1 className="myApp-heading1">Welcome Back!</h1>
              <p className="myApp-paragraph">To get started please login!</p>
              <button
                className="myApp-ghost myApp-button"
                id="signIn"
                onClick={() => setIsRightPanelActive(false)}
              >
                Sign In
              </button>
            </div>
            <div className="myApp-overlay-panel myApp-overlay-right">
              <h1 className="myApp-heading1">Hello, Friend!</h1>
              <p className="myApp-paragraph">
                Enter your personal details and start your journey
              </p>
              <button
                className="myApp-ghost myApp-button"
                id="signUp"
                onClick={() => setIsRightPanelActive(true)}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthContainer;
