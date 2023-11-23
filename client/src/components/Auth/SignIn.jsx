import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faGoogle,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    try {
      const response = await axios.post("http://localhost:9000/api/users/login", {
        email,
        password,
      });

      const token = response.data.token;
      localStorage.setItem("userToken", token);

      
      checkUserWorkspace();
    } catch (error) {
      console.error(error);
      
    }
  };


const checkUserWorkspace = async () => {
  try {
    const response = await axios.get("http://localhost:9000/api/workspaces/workspace-status", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`
      }
    });

    if (response.data.hasWorkspace) {
      navigate("/dashboard"); 
    } else {
      navigate("/workspace-modal"); 
    }
  } catch (error) {
    console.error('Fehler beim Abrufen des Workspace-Status:', error);
   
  }

  
};

  return (
    <div className="myApp-form-container myApp-sign-in-container">
      <form className="myApp-form" onSubmit={(e) => e.preventDefault()}>
        <h1 className="myApp-heading1">Sign in</h1>
        <div className="myApp-social-container">
          <FontAwesomeIcon icon={faFacebookF} className="myApp-social-icon" />
          <button id="signInButton">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                console.log(credentialResponse);
              }}
              onError={() => {
                console.log("Login Failed");
              }}
            />
            ;
          </button>
          <FontAwesomeIcon icon={faLinkedinIn} className="myApp-social-icon" />
        </div>
        <span className="myApp-paragraph">or use your account</span>
        <input
          className="myApp-input"
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="myApp-input"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Link to="/" className="myApp-link">
          Forgot your password?
        </Link>
        <button className="myApp-button" onClick={handleSignIn}>
          Sign In
        </button>
      </form>
    </div>
  );
};

export default SignIn;
