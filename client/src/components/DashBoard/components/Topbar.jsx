import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MagnifyingGlassIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";


const TopBar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const handleLogout = () => {
    // Remove the token from LocalStorage
    localStorage.removeItem("userToken");
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Searchbar */}
      <div className="relative p-4 flex items-center">
        {/* Search icon inside the input field */}
        <div className="absolute left-4 inset-y-0 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 ml-2 text-gray-800" />
        </div>

        {/* Input field */}
        <input
          type="text"
          className="pl-10 pr-8 py-2 rounded w-full" // padding adjusted for icons
          placeholder="Nachrichten suchen"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Hamburger menu icon enlarged and moved inside the input field */}
        <div className="absolute right-4 inset-y-0 flex items-center">
          <Bars3Icon className="w-6 h-6 mr-2" onClick={toggleDropdown} />{" "}
          {/* Size increased */}
        </div>

        {/* Dropdown menu */}
        {showDropdown && (
          <div
            ref={dropdownRef}
            className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-md flex flex-col"
          >
            {/* Add menu items here */}
            <button className="p-2 hover:bg-gray-100" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default TopBar;
