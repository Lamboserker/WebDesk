import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import StyledInput from "../../StyledInput/StyledInput";

const AccountSettings = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="mx-4 min-h-screen max-w-screen-xl sm:mx-8 xl:mx-auto">
      <h1 className="mb-10 text-3xl font-extrabold text-gray-900 dark:text-white  md:text-5xl lg:text-6xl ">Account Settings</h1>
      <div className="bg-white shadow-md rounded-xl px-10 py-8 mb-8 flex flex-col space-y-6 mt-3">

        
        <div>
          <StyledInput
            searchTerm={email}
            setSearchTerm={setEmail}
            label="Email Address"
            id="email"
            type="text"
            placeholder=""
            className="text-black"
          />
        </div>

        <div className="flex items-center space-x-2">
          <StyledInput
            searchTerm={password}
            setSearchTerm={setPassword}
            label="Password"
            className="shadow border rounded w-full py-3 px-4 "
            id="password"
            type={showPassword ? "text" : "password"}
            Icon={() => (
              <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
            )}
            onIconClick={togglePasswordVisibility}
            placeholder=""
          />
          
        </div>

        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded mt-5"
            type="button"
          >
            Save Password
          </button>
          <a
            className="font-bold text-sm text-blue-600 hover:text-blue-800"
            href="#recover"
          >
            Can't remember your password?
          </a>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900">Delete Account</h3>
          <p className="mt-1 text-sm text-gray-500">Proceed with caution</p>
        </div>

        <div>
          <p className="text-sm text-gray-600">
            Make sure you have taken backup of your account in case you ever
            need to get access to your data. We will completely wipe your data.
            There is no way to access your account after this action.
          </p>
          <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center space-x-2 mt-5">
            <FontAwesomeIcon icon={faTrashAlt} />
            <span>Delete Account</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
