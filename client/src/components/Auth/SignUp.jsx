import React, {useState} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faGooglePlusG,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";
import axios from "axios";
import "../styles/authstyles.css";


const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    try {
      const response = await axios.post("http://localhost:9000/api/users/register", {
        name,
        email,
        password,
      });
      console.log(response.data); // Bearbeiten Sie die Antwort entsprechend
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="myApp-form-container myApp-sign-up-container">
      <form className="myApp-form" action="#">
        <h1 className="myApp-heading1">Create Account</h1>
        <div className="myApp-social-container">
          <FontAwesomeIcon icon={faFacebookF} className="myApp-social-icon" />
          <FontAwesomeIcon icon={faGooglePlusG} className="myApp-social-icon" />
          <FontAwesomeIcon icon={faLinkedinIn} className="myApp-social-icon" />
        </div>
        <span className="myApp-paragraph">
          or use your email for registration
        </span>
        <input
          className="myApp-input"
          type="text"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />
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
        <button className="myApp-button" onClick={handleSignUp}>
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;
