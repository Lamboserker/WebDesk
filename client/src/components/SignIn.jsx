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
    <div className="form-container sign-in-container">
      <form className="form" action="#">
        <h1 className="h1">Sign in</h1>
        <div className="social-container">
          <FontAwesomeIcon icon={faFacebookF} className="social-icon" />
          <FontAwesomeIcon icon={faGooglePlusG} className="social-icon" />
          <FontAwesomeIcon icon={faLinkedinIn} className="social-icon" />
        </div>
        <span className="span">or use your account</span>
        <input className="input" type="email" placeholder="Email" />
        <input className="input" type="password" placeholder="Password" />
        <Link to="/" className="a">Forgot your password?</Link>
        <button className="button">Sign In</button>
      </form>
    </div>
  );
};

export default SignIn;
