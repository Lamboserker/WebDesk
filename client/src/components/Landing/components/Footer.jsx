import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faTwitter,
  faLinkedin,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <>
      <footer className="xs:pt-32   bg-transparent h-full ">
        <div className="container mx-auto px-6 pt-10 pb-6">
          <div className="flex flex-wrap">
            <div className="w-full md:w-1/4 text-center md:text-left">
              <h5 className="uppercase mb-6 font-bold text-luckyPoint-100">
                Links
              </h5>
              <ul className="mb-4">
                <li className="mt-2">
                  <a
                    href="/"
                    className="hover:underline text-luckyPoint-200 hover:text-luckyPoint-600"
                  >
                    FAQ
                  </a>
                </li>
                <li className="mt-2">
                  <a
                    href="/"
                    className="hover:underline text-luckyPoint-200 hover:text-luckyPoint-600"
                  >
                    Help
                  </a>
                </li>
                <li className="mt-2">
                  <a
                    href="/"
                    className="hover:underline text-luckyPoint-200 hover:text-luckyPoint-600"
                  >
                    Support
                  </a>
                </li>
              </ul>
            </div>
            <div className="w-full md:w-1/4 text-center md:text-left">
              <h5 className="uppercase mb-6 font-bold text-luckyPoint-100">
                Legal
              </h5>
              <ul className="mb-4">
                <li className="mt-2">
                  <a
                    href="/"
                    className="hover:underline text-luckyPoint-200 hover:text-luckyPoint-600"
                  >
                    GTC
                  </a>
                </li>
                <li className="mt-2">
                  <a
                    href="/"
                    className="hover:underline text-luckyPoint-200 hover:text-luckyPoint-600"
                  >
                    Data protection
                  </a>
                </li>
                <li className="mt-2">
                  <a
                    href="/"
                    className="hover:underline text-luckyPoint-200 hover:text-luckyPoint-600"
                  >
                    Imprint
                  </a>
                </li>
              </ul>
            </div>
            <div className="w-full md:w-1/4 text-center md:text-left">
              <h5 className="uppercase mb-6 font-bold text-luckyPoint-100">
                Company
              </h5>
              <ul className="mb-4">
                <li className="mt-2">
                  <a
                    href="/"
                    className="hover:underline text-luckyPoint-200 hover:text-luckyPoint-600"
                  >
                    About us
                  </a>
                </li>
                <li className="mt-2">
                  <a
                    href="/"
                    className="hover:underline text-luckyPoint-200 hover:text-luckyPoint-600"
                  >
                    Career
                  </a>
                </li>
                <li className="mt-2">
                  <a
                    href="/"
                    className="hover:underline text-luckyPoint-200 hover:text-luckyPoint-600"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div className="w-full md:w-1/4 text-center md:text-left">
              <h5 className="uppercase mb-6 font-bold text-luckyPoint-100">
                Follow us
              </h5>
              <div className="flex items-center justify-center md:justify-start">
                <FontAwesomeIcon
                  icon={faTwitter}
                  href="https://twitter.com"
                  className="flex items-center bg-gray-200 rounded-full p-2 mr-4 hover:bg-gray-400"
                >
                  <i className="fab fa-twitter text-blue-500"></i>
                </FontAwesomeIcon>
                <FontAwesomeIcon
                  icon={faFacebook}
                  href="https://facebook.com"
                  className="flex items-center bg-gray-200 rounded-full p-2 mr-4 hover:bg-gray-400"
                >
                  <i className="fab fa-facebook-f text-blue-600"></i>
                </FontAwesomeIcon>
                <FontAwesomeIcon
                  icon={faInstagram}
                  href="https://instagram.com"
                  className="flex items-center bg-gray-200 rounded-full p-2 mr-4 hover:bg-gray-400"
                >
                  <i className="fab fa-instagram text-pink-400"></i>
                </FontAwesomeIcon>
                <FontAwesomeIcon
                  icon={faGithub}
                  href="https://github.com"
                  className="flex items-center bg-gray-200 rounded-full p-2 mr-4 hover:bg-gray-400"
                >
                  <i className="fab fa-github text-pink-400"></i>
                </FontAwesomeIcon>
                <FontAwesomeIcon
                  icon={faLinkedin}
                  href="https://github.com"
                  className="flex items-center bg-gray-200 rounded-full p-2 mr-4 hover:bg-gray-400"
                >
                  <i className="fab fa-github text-pink-400"></i>
                </FontAwesomeIcon>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
