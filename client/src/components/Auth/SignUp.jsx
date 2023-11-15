import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faGooglePlusG,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";

const SignUp = () => {
  return (
    <div className="form-container sign-up-container">
      <form className="form" action="#">
        <h1 className="h1">Create Account</h1>
        <div className="social-container">
          <FontAwesomeIcon icon={faFacebookF} className="social-icon" />
          <FontAwesomeIcon icon={faGooglePlusG} className="social-icon" />
          <FontAwesomeIcon icon={faLinkedinIn} className="social-icon" />
        </div>
        <span className="span">or use your email for registration</span>
        <input className="input" type="text" placeholder="Name" />
        <input className="input" type="email" placeholder="Email" />
        <input className="input" type="password" placeholder="Password" />
        <button className="button">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
