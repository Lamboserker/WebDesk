import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const HoverComponent = ({ children, userId }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [userData, setUserData] = useState({});
    const popoverRef = useRef(null);
    const targetRef = useRef(null);

  useEffect(() => {
    if (isVisible && userId) {
      axios
        .get(`http://localhost:9000/api/users/by-ids?userIds[]=${userId}`)
        .then((response) => {
          if (response.data && response.data.length > 0) {
            setUserData(response.data[0]);
            console.log("userData loaded: " ,userData);
          }
        })
        .catch((error) => console.error("Error fetching user data:", error));
    }
  }, [isVisible, userId]);

  const calculatePopoverPosition = () => {
    // Standardpositionierung (rechts), erlaubt Überlappen in den Maincontent
    return 'left-full';
  };

  return (
    <div
    ref={targetRef}
    className="relative"
    onMouseEnter={() => setIsVisible(true)}
    onMouseLeave={() => setIsVisible(false)}
  >
      {children}
      {isVisible && (
        <div 
          ref={popoverRef} 
          className={`absolute  bg-white shadow-lg rounded-2xl w-80 dark:bg-gray-800 ${calculatePopoverPosition()}`} 
          style={{ left: 0, zIndex: 1000 }}
        >
          <div className="bg-white shadow-lg rounded-2xl w-80 dark:bg-gray-800">
            <img
              alt="profil"
              src="https://images.unsplash.com/photo-1511300636408-a63a89df3482?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGxhbmRzY2FwZSUyMGNhcnRvb258ZW58MHx8MHx8fDA%3D"
              className="w-full mb-4 rounded-t-lg h-28"
            />
            <div className="flex flex-col items-center justify-center p-4 -mt-16">
              <a href="/" className="relative block">
                <img
                  alt="profil"
                  src={`http://localhost:9000/${userData.profileImage}`}
                  className="mx-auto object-cover rounded-full h-16 w-16  border-2 border-white dark:border-gray-800"
                />
              </a>
              <p className="mt-2 text-xl font-medium text-gray-800 dark:text-white">
                {userData.name}
              </p>
              <p className="mb-4 text-xs text-gray-400"></p>
              <p className="p-2 px-4 text-xs text-white bg-pink-500 rounded-full">
                Professional
              </p>
              <div className="w-full p-2 mt-4 rounded-lg">
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-200">
                  <p className="flex flex-col">
                    Articles
                    <span className="font-bold text-black dark:text-white">
                      34
                    </span>
                  </p>
                  <p className="flex flex-col">
                    Followers
                    <span className="font-bold text-black dark:text-white">
                      455
                    </span>
                  </p>
                  <p className="flex flex-col">
                    Rating
                    <span className="font-bold text-black dark:text-white">
                      9.3
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HoverComponent;
