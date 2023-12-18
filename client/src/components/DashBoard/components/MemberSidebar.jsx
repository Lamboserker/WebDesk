import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { WorkspaceContext } from "../../../Context/WorkspaceContext";

const MemberSidebar = () => {
  const [members, setMembers] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isTextVisible, setIsTextVisible] = useState(false);
  const { selectedWorkspace } = useContext(WorkspaceContext);

  const iconHeight = 60;
  const memberHeight = 73;
  const maxSidebarHeight = iconHeight + members.length * memberHeight;

  const fetchWorkspaceMembers = async (workspaceId) => {
    console.log("workspaceID:", workspaceId);
    const token = localStorage.getItem("userToken");
    try {
      const response = await axios.get(
        `http://localhost:9000/api/workspaces/${workspaceId}/users`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMembers(response.data);
    } catch (error) {
      console.error("Error fetching workspace members:", error);
    }
  };

  useEffect(() => {
    fetchWorkspaceMembers(selectedWorkspace);
  }, [selectedWorkspace]);

  const handleMouseEnter = () => {
    setIsExpanded(true);
    setTimeout(() => {
      setIsTextVisible(true);
    }, 300); // Setzt isTextVisible mit Verzögerung
  };

  const handleMouseLeave = () => {
    setIsExpanded(false);
    setIsTextVisible(false); // Setzt isTextVisible sofort zurück
  };

  const sidebarClasses = ` transition-all duration-300 ease-in-out mr-3 fixed right-0 top-1/2 transform -translate-y-1/2  ${
    isExpanded ? "opacity-80" : "backdrop-blur-md bg-opacity-30"
  } rounded-lg ${isExpanded ? "w-60" : "w-16"}`;

  const listItemClasses = (index) =>
    `flex items-center w-full px-2 ${index === 0 ? "mt-4" : "my-2"}`;

  return (
    <div
      className={sidebarClasses}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ maxHeight: `${maxSidebarHeight}px` }}
    >
      <ul className="flex flex-col items-center justify-end relative p-1 bg-luckyPoint-500 rounded-md">
        <li className="my-2 w-full flex justify-center">
          {" "}
          {/* Flexbox für Zentrierung */}
          <svg
            viewBox="0 0 1024 1024"
            className="h-8 w-8"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M691.573 338.89c-1.282 109.275-89.055 197.047-198.33 198.331-109.292 1.282-197.065-90.984-198.325-198.331-0.809-68.918-107.758-68.998-106.948 0 1.968 167.591 137.681 303.31 305.272 305.278C660.85 646.136 796.587 503.52 798.521 338.89c0.811-68.998-106.136-68.918-106.948 0z"
              fill="#4A5699"
            />
            <path
              d="M294.918 325.158c1.283-109.272 89.051-197.047 198.325-198.33 109.292-1.283 197.068 90.983 198.33 198.33 0.812 68.919 107.759 68.998 106.948 0C796.555 157.567 660.839 21.842 493.243 19.88c-167.604-1.963-303.341 140.65-305.272 305.278-0.811 68.998 106.139 68.919 106.947 0z"
              fill="#C45FA0"
            />
            <path
              d="M222.324 959.994c0.65-74.688 29.145-144.534 80.868-197.979 53.219-54.995 126.117-84.134 201.904-84.794 74.199-0.646 145.202 29.791 197.979 80.867 54.995 53.219 84.13 126.119 84.79 201.905 0.603 68.932 107.549 68.99 106.947 0-1.857-213.527-176.184-387.865-389.716-389.721-213.551-1.854-387.885 178.986-389.721 389.721-0.601 68.991 106.349 68.933 106.949 0.001z"
              fill="#E5594F"
            />
          </svg>
        </li>
        {members.map((member, index) => (
          <li key={member._id} className={listItemClasses(index)}>
            <img
              src={
                `http://localhost:9000/${member.profileImage}` ||
                member.profileImage ||
                "https://img.freepik.com/premium-vector/social-media-user-profile-icon-video-call-screen_97886-10046.jpg"
              }
              alt="Profile"
              className="rounded-full w-10 h-10 object-cover " // Margin rechts für Abstand zum Text
            />
            
            {isTextVisible && (
              <span className="text-white ml-5">{member.name}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MemberSidebar;
