import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faGooglePlusG,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";

const SignUp = () => {
  return (
    <div className="myApp-form-container myApp-sign-up-container">
      <form className="myApp-form" action="#">
        <h1 className="myApp-heading1">Create Account</h1>
        <div className="myApp-social-container">
          <FontAwesomeIcon icon={faFacebookF} className="myApp-social-icon" />
          <FontAwesomeIcon icon={faGooglePlusG} className="myApp-social-icon" />
          <FontAwesomeIcon icon={faLinkedinIn} className="myApp-social-icon" />
        </div>
        <span className="myApp-paragraph">or use your email for registration</span>
        <input className="myApp-input" type="text" placeholder="Name" />
        <input className="myApp-input" type="email" placeholder="Email" />
        <input
          className="myApp-input"
          type="password"
          placeholder="Password"
        />
        <button className="myApp-button">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
