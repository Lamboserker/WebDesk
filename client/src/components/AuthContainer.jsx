import React, { useState } from "react";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import "./styles/AuthStyles.css";

const AuthContainer = () => {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);

  return (
    <div className="body">
    <div
      className={`container ${isRightPanelActive ? "right-panel-active" : ""}`}
      id="container"
    >
      <SignUp />
      <SignIn />
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h1 className="h1">Welcome Back!</h1>
            <p className="p">
              To get started please login!
            </p>
            <button
              className="ghost button"
              id="signIn"
              onClick={() => setIsRightPanelActive(false)}
            >
              Sign In
            </button>
          </div>
          <div className="overlay-panel overlay-right">
            <h1 className="h1">Hello, Friend!</h1>
            <p>Enter your personal details and start journey with us</p>
            <button
              className="ghost button"
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
