import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import axios from "axios";

const HoverComponent = ({ children, userId }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [userData, setUserData] = useState({});
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
  const popoverRef = useRef(null);
  const targetRef = useRef(null);

  useEffect(() => {
    if (isVisible && userId) {
      axios
        .get(`http://localhost:9000/api/users/by-ids?userIds[]=${userId}`)
        .then((response) => {
          if (response.data && response.data.length > 0) {
            setUserData(response.data[0]);
            console.log("userData loaded: ", userData);
          }
        })
        .catch((error) => console.error("Error fetching user data:", error));
    }
  }, [isVisible, userId]);

  const calculatePopoverPosition = () => {
    if (targetRef.current) {
      const targetRect = targetRef.current.getBoundingClientRect();

      // Fester Offset
      const offsetTop = 10; // Vertikaler Offset
      const offsetRight = 10; // Horizontaler Offset

      setPopoverPosition({
        top: targetRect.bottom + offsetTop, // Positionieren Sie es unterhalb des Zielobjekts
        left: targetRect.right + offsetRight, // Rechts vom Zielobjekt
      });
    }
  };

  return (
    <div
      ref={targetRef}
      className="relative"
      onMouseEnter={() => {
        setIsVisible(true);
        calculatePopoverPosition();
      }}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible &&
        createPortal(
          <div
            ref={popoverRef}
            className="absolute bg-white shadow-lg rounded-2xl w-80 dark:bg-gray-800"
            style={{
              top: popoverPosition.top,
              left: popoverPosition.left,
              zIndex: 1000,
            }}
          >
            <div className="bg-luckyPoint-200 shadow-lg rounded-2xl w-80 dark:bg-luckyPoint-800">
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
                <p className="mb-4 text-xs text-luckyPoint-400"></p>
                <p className="p-2 px-4 text-xs text-luckyPoint-200 bg-luckyPoint-500 rounded-full">
                  Professional
                </p>
                <div className="w-full p-2 mt-4 rounded-lg">
                  <div className="flex items-center justify-between text-sm text-luckyPoint-600 dark:text-luckyPoint-200">
                    <p className="flex flex-col">
                      Articles
                      <span className="font-bold text-black dark:text-white">
                        34
                      </span>
                    </p>
                    <p className="flex flex-col">
                      Followers
                      <span className="font-bold text-black dark:text-luckyPoint-200">
                        455
                      </span>
                    </p>
                    <p className="flex flex-col">
                      Rating
                      <span className="font-bold text-black dark:text-luckyPoint-200">
                        9.3
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default HoverComponent;
