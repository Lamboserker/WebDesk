import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faGooglePlusG,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";

const SignIn = () => {
  return (
    <div className="myApp-form-container myApp-sign-in-container">
      <form className="myApp-form" action="#">
        <h1 className="myApp-heading1">Sign in</h1>
        <div className="myApp-social-container">
          <FontAwesomeIcon icon={faFacebookF} className="myApp-social-icon" />
          <FontAwesomeIcon icon={faGooglePlusG} className="myApp-social-icon" />
          <FontAwesomeIcon icon={faLinkedinIn} className="myApp-social-icon" />
        </div>
        <span className="myApp-paragraph">or use your account</span>
        <input className="myApp-input" type="email" placeholder="Email" />
        <input
          className="myApp-input"
          type="password"
          placeholder="Password"
        />
        <Link to="/" className="myApp-link">
          Forgot your password?
        </Link>
        <button className="myApp-button">Sign In</button>
      </form>
    </div>
  );
};

export default SignIn;
