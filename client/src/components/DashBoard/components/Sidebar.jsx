import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  useCallback,
} from "react";
import axios from "axios";
import Modal from "../../Modal/VideoModal";
import VideoApp from "../../Video/VideoApp";
import WorkspaceModule from "../Dropdown/WorkspaceModule";
import { useNavigate } from "react-router-dom";
import {
  PlusIcon,
  HashtagIcon,
  Bars3BottomLeftIcon,
  ChatBubbleBottomCenterIcon,
  SpeakerWaveIcon,
  UserGroupIcon,
  MegaphoneIcon,
  ComputerDesktopIcon,
} from "@heroicons/react/24/outline";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Typography,
} from "@material-tailwind/react";
import "../../styles/dashboard.css";
import { WorkspaceContext } from "../../../Context/WorkspaceContext";
import CreateChannel from "../../Popup/CreateChannel";
import WorkspaceDropdown from "../Dropdown/WorkspaceDropdown";
import io from "socket.io-client";

const SideBar = ({ activeChannel, setActiveChannel }) => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [channels, setChannels] = useState([]);
  const [imageLoadError] = useState(false);
  const [userData, setUserData] = useState({ sender: "", senderImage: "" });
  const [members, setMembers] = useState([]);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [channelPopupIsOpen, setChannelPopupIsOpen] = useState(false);
  const [newMessagesCount, setNewMessagesCount] = useState({});
  const [channelPopupKey, setChannelPopupKey] = useState(0);
  const [hoveredChannel, setHoveredChannel] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
  const [showWorkspaceOverview, setShowWorkspaceOverview] = useState(false);
  const socket = useRef(null);
  const workspaceRef = useRef(null);
  const [sidebarWidth, setSidebarWidth] = useState(
    parseInt(localStorage.getItem("sidebarWidth")) || 200
  );
  const { selectedWorkspace, setSelectedWorkspace, workspaces } =
    useContext(WorkspaceContext);
  const sidebarRef = useRef(null);
  const triggerRef = useRef(null);
  const dividerStyle = "relative w-48 h-px bg-gray-400 my-4 mb-10 ";
  let navigate = useNavigate();

  const MIN_SIDEBAR_WIDTH = 200;
  const MAX_SIDEBAR_WIDTH = 400;

  useEffect(() => {
    const lastActiveWorkspace = localStorage.getItem("lastActiveWorkspace");
    if (lastActiveWorkspace) {
      setSelectedWorkspace(lastActiveWorkspace);
    } else if (workspaces && workspaces.length > 0) {
      const firstWorkspace = workspaces[0].id; // Nehmen Sie an, dass Workspaces eine ID-Eigenschaft haben
      setSelectedWorkspace(firstWorkspace);
      localStorage.setItem("lastActiveWorkspace", firstWorkspace);
    }
  }, [workspaces]);

  useEffect(() => {
    if (selectedWorkspace) {
      localStorage.setItem("lastActiveWorkspace", selectedWorkspace);
    }
  }, [selectedWorkspace]);

  const handleMouseDownOnResizeBar = useCallback((e) => {
    e.preventDefault();
    window.addEventListener("mousemove", onResize);
    window.addEventListener("mouseup", stopResizing);
  }, []); // Keine Abhängigkeiten, da es sich um eine stabile Operation handelt

  const onResize = useCallback((e) => {
    let newWidth = e.clientX - sidebarRef.current.getBoundingClientRect().left;
    newWidth = Math.max(newWidth, MIN_SIDEBAR_WIDTH);
    newWidth = Math.min(newWidth, MAX_SIDEBAR_WIDTH);
    setSidebarWidth(newWidth);
    localStorage.setItem("sidebarWidth", newWidth.toString());
  }, []); // Sie können Abhängigkeiten hinzufügen, wenn es notwendig ist

  const stopResizing = useCallback(() => {
    window.removeEventListener("mousemove", onResize);
    window.removeEventListener("mouseup", stopResizing);
  }, []); // Keine Abhängigkeiten, da es sich um eine stabile Operation handelt

  const openVideoModal = () => {
    setIsVideoModalOpen(true);
  };

  const closeVideoModal = () => {
    setIsVideoModalOpen(false);
  };

  const handleChannelClick = (channel, e) => {
    setActiveChannel(channel);
    if (window.innerWidth < 768) {
      setIsMobileSidebarOpen(false);
    }
  };

  useEffect(() => {
    // Initialisieren der Socket-Verbindung
    socket.current = io("http://localhost:9000");

    socket.current.on("connect", () => {
      console.log("Connected to the server");
    });

    // Event Listener für neue Nachrichten
    socket.current.on("newMessage", (message) => {
      // Angenommen, `message` hat die Eigenschaften `channelId` und `count`
      setNewMessagesCount((prevCounts) => ({
        ...prevCounts,
        [message.channelId]:
          (prevCounts[message.channelId] || 0) + message.count,
      }));
    });

    // Aufräumen bei Unmount
    return () => {
      socket.current.disconnect();
    };
  }, []);

  useEffect(() => {
    const savedWorkspaceId = localStorage.getItem("lastVisitedWorkspace");
    if (savedWorkspaceId) {
      setSelectedWorkspace(savedWorkspaceId);
    }
  }, []);

  useEffect(() => {
    if (workspaces && workspaces.length === 1) {
      const singleWorkspaceId = workspaces[0].id;
      setSelectedWorkspace(singleWorkspaceId);
      // Fetching channels and members for the single workspace
      fetchChannels(singleWorkspaceId);
      fetchWorkspaceMembers(singleWorkspaceId);
    }
    // This effect should run when the `workspaces` array changes
  }, [workspaces]);

  const fetchChannels = async (workspaceId) => {
    console.log("workspace here is:", workspaceId);
    const token = localStorage.getItem("userToken");
    try {
      const response = await axios.get(
        `http://localhost:9000/api/workspaces/${workspaceId}/channels`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setChannels(response.data);
    } catch (error) {
      console.error("Error fetching channels:", error);
    }
  };

  const fetchWorkspaceMembers = async (workspaceId) => {
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
    fetchChannels(selectedWorkspace);
    fetchWorkspaceMembers(selectedWorkspace);
  }, [selectedWorkspace]);

  const handleCreateChannel = () => {
    setChannelPopupIsOpen(true);
    setChannelPopupKey((prevKey) => prevKey + 1); // Erhöht den Schlüssel bei jedem Öffnen
  };

  const handleLogout = () => {
    // Remove the token from LocalStorage
    localStorage.removeItem("userToken");
    navigate("/");
  };

  async function validateToken() {
    try {
      const response = await axios.get(
        "http://localhost:9000/api/users/validate-token",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      if (response.data.valid) {
        return response.data.userId;
      } else {
        throw new Error("Invalid token");
      }
    } catch (error) {
      console.error("Token validation error:", error);
      return null;
    }
  }

  // Vorabladen und Caching der Benutzerdaten

  // fetch current user information
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("userToken");
        const userId = await validateToken();
        // console.log("Aktuelle Benutzer-ID:", userId); // Zur Diagnose hinzugefügt
        const response = await axios.get("http://localhost:9000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
          params: { userId: userId },
        });
        setUserData({
          _id: userId,
          name: response.data.name,
          profileImage: response.data.profileImage,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const navigateToUserProfile = () => {
    navigate("/user-profile");
  };

  const handleVideoIconClick = (e) => {
    e.stopPropagation();
    setIsVideoModalOpen(true);
  };

  channels.sort((a, b) => {
    const order = ["Text", "Voice", "Stage", "Forum", "Announcement"];
    return order.indexOf(a.type) - order.indexOf(b.type);
  });

  const getChannelIcon = (channelType, isHovered) => {
    const baseClass = "h-6 w-6 mr-8 ";
    const defaultClass = "text-luckyPoint-500 dark:text-luckyPoint-200 ";
    const hoverClass = "text-luckyPoint-200 dark:text-luckyPoint-900 ";
    switch (channelType) {
      case "textChannel":
        return (
          <ChatBubbleBottomCenterIcon
            className={baseClass + (isHovered ? hoverClass : defaultClass)}
          />
        );
      case "voiceChannel":
        return (
          <SpeakerWaveIcon
            isToggled={isVideoModalOpen}
            onClose={closeVideoModal}
            onClick={handleVideoIconClick}
            className={baseClass + (isHovered ? hoverClass : defaultClass)}
          />
        );
      case "stage":
        return (
          <UserGroupIcon
            className={baseClass + (isHovered ? hoverClass : defaultClass)}
          />
        );
      case "forum":
        return (
          <ComputerDesktopIcon
            className={baseClass + (isHovered ? hoverClass : defaultClass)}
          />
        );
      case "announcement":
        return (
          <MegaphoneIcon
            className={baseClass + (isHovered ? hoverClass : defaultClass)}
          />
        );
      default:
        return (
          <HashtagIcon
            className={baseClass + (isHovered ? hoverClass : defaultClass)}
          />
        );
    }
  };

  const handleWorkspaceClick = (event) => {
    event.stopPropagation();
    const x = event.clientX; // X-Koordinate des Klicks
    const y = event.clientY; // Y-Koordinate des Klicks
    setDropdownPosition({ x, y });
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleOutsideClick = (event) => {
    event.stopPropagation();
    const modalElement = document.getElementById("workspaceSettingsModal"); // Stellen Sie sicher, dass dieses ID in Ihrer WorkspaceSettingsModal Komponente vorhanden ist
    if (modalElement && !modalElement.contains(event.target)) {
      setIsDropdownOpen(false); // Oder eine andere Methode, um das Modal zu schließen
    }
  };

  useEffect(() => {
    // Fügen Sie den Event-Listener hinzu
    document.addEventListener("click", handleOutsideClick);
    // Entfernen Sie den Event-Listener beim Cleanup
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <>
      <div
        ref={sidebarRef}
        style={{ width: `${sidebarWidth}px` }}
        className={`relative flex flex-col justify-between h-full border-r-2 border-luckyPoint-900 ${
          isMobileSidebarOpen ? "block" : "hidden"
        } lg:block`}
      >
        {/* sidebar */}

        <div className="h-screen ">
          {/* Top Bar/Header */}
          <div className="flex items-center justify-between h-16 px-4 absolute top-0 left-0 lg:justify-start">
            {/* Hamburger-Menü-Icon */}
            <div className="lg:hidden relative sidebar-icon-background">
              <button
                className="relative"
                onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              >
                <Bars3BottomLeftIcon className="w-6 h-6 text-black dark:text-white" />
              </button>
            </div>
          </div>

          {/* workspace name for desktop view */}
          <div
            ref={workspaceRef}
            onClick={handleWorkspaceClick}
            className="relative"
          >
            <WorkspaceModule
              onClick={handleWorkspaceClick}
              sidebarWidth={sidebarWidth}
              isScrollDisabled={workspaces && workspaces.length === 1}
              setShowWorkspaceOverview={setShowWorkspaceOverview}
            />
          </div>
          {isDropdownOpen && (
            <WorkspaceDropdown
              id="workspaceDropdown"
              position={dropdownPosition}
              triggerRef={triggerRef}
            />
          )}
          {/* Primary Navigation */}
          <ul className="flex flex-col py-4 space-y-1">
            <li>
              <div
                href="/"
                className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-luckyPoint-50 text-luckyPoint-600 hover:text-luckyPoint-800 border-l-4 border-transparent hover:border-luckyPoint-500 pr-6"
              >
                <span className="inline-flex justify-center items-center ml-4">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    ></path>
                  </svg>
                </span>
                <span className="ml-2 text-sm tracking-wide truncate  ">
                  Notifications
                </span>
                <span className="px-2 py-0.5 ml-auto text-xs font-medium tracking-wide text-red-500 bg-red-50 rounded-full">
                  1.2k
                </span>
              </div>
            </li>
            <li>
              <a
                href="/"
                className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-luckyPoint-50 text-luckyPoint-600 hover:text-luckyPoint-800 border-l-4 border-transparent hover:border-luckyPoint-500 pr-6"
              >
                <span className="inline-flex justify-center items-center ml-4">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    ></path>
                  </svg>
                </span>
                <span className="ml-2 text-sm tracking-wide truncate">
                  Inbox
                </span>
                <span className="px-2 py-0.5 ml-auto text-xs font-medium tracking-wide text-luckyPoint-500 bg-luckyPoint-50 rounded-full">
                  New
                </span>
              </a>
            </li>
            {/* Direct Messages Section */}

            <li>
              <div className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-luckyPoint-50 text-luckyPoint-600 hover:text-luckyPoint-800 border-l-4 border-transparent hover:border-luckyPoint-500 pr-6">
                <div className="flex flex-row items-center">
                  <span className="inline-flex justify-center items-center ml-4">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                      />
                    </svg>
                  </span>
                  <span className="ml-2 text-sm tracking-wide truncate">
                    Messages
                  </span>
                </div>
              </div>
            </li>

            {/* Channels Section */}

            <div
              style={{ width: sidebarWidth }}
              className={`${dividerStyle} `}
            ></div>

            {/* Plus icon in a new list item */}
            <li>
              <button
                onClick={handleCreateChannel}
                className="flex justify-start items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6 mb-2 ml-4"
              >
                <PlusIcon className="h-5 w-5 text-black dark:text-luckyPoint-200" />
                <span className="ml-2 tracking-wide truncate">
                  Create Channel
                </span>
              </button>
            </li>
            {channelPopupIsOpen && <CreateChannel key={channelPopupKey} />}
            {console.log("HERE IT IS:", selectedWorkspace)}
            <li className="max-h-[20em] overflow-y-auto">
              <div className="relative flex flex-row items-center h-11 focus:outline-none  text-gray-600  border-l-4 border-transparent  pr-6 mb-2 cursor-default">
                <span className="inline-flex justify-center items-center ml-4">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19.5 5.25l-7.5 7.5-7.5-7.5m15 6l-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </span>
                <span className="ml-2 text-sm tracking-wide truncate ">
                  Channels
                </span>
                {newMessagesCount[channels._id] > 0 && (
                  <span className="px-2 py-0.5 ml-auto text-xs font-medium tracking-wide text-red-500 bg-red-50 rounded-full">
                    {newMessagesCount[channels._id]}
                  </span>
                )}
              </div>
              {/* List of channels */}

              {channels.map((channel) => (
                <div
                  key={channel._id}
                  onMouseEnter={() => setHoveredChannel(channel._id)}
                  onMouseLeave={() => setHoveredChannel(null)}
                  className="flex justify-between items-center py-2 text-sm font-medium hover:bg-luckyPoint-700 ml-6 mb-2 "
                >
                  {getChannelIcon(channel.type, hoveredChannel === channel._id)}
                  <div className="flex flex-grow items-center">
                    <button
                      onClick={() => handleChannelClick(channel._id)}
                      className="truncate text-black dark:text-luckyPoint-200 hover:text-luckyPoint-700"
                    >
                      {channel.name}
                    </button>
                  </div>
                </div>
              ))}
            </li>

            <div style={{ width: sidebarWidth }} className={dividerStyle}></div>
          </ul>
          {/* Secondary Navigation/Footer */}
          <div className="px-4 mt-2  absolute bottom-0">
            <button className="flex items-center py-2 text-sm text-black dark:text-luckyPoint-200 font-medium hover:bg-luckyPoint-700 w-full text-left">
              Preferences
            </button>
            <button className="flex items-center py-2 text-sm text-black dark:text-luckyPoint-200 font-medium hover:bg-luckyPoint-700 w-full text-left">
              Help
            </button>

            {/* User profile section */}
            <div className="  py-5 mt-auto relative bottom-0 left-0">
              <div className="flex items-center space-x-3">
                {!imageLoadError && userData.profileImage ? (
                  <>
                    <Menu>
                      <MenuHandler>
                        <Avatar
                          variant="circular"
                          alt="User"
                          className="cursor-pointer h-10 w-10 rounded-full border-2 border-luckyPoint-300 object-cover"
                          src={`http://localhost:9000/${userData.profileImage}`}
                        />
                      </MenuHandler>
                      <MenuList className="bg-luckyPoint-200 dark:bg-luckyPoint-700">
                        <MenuItem
                          style={{ height: "50px" }}
                          onClick={() => navigate("/profile-settings")}
                          className="flex items-center gap-2 text-black dark:text-luckyPoint-200 "
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M16 8C16 10.1217 15.1571 12.1566 13.6569 13.6569C12.1566 15.1571 10.1217 16 8 16C5.87827 16 3.84344 15.1571 2.34315 13.6569C0.842855 12.1566 0 10.1217 0 8C0 5.87827 0.842855 3.84344 2.34315 2.34315C3.84344 0.842855 5.87827 0 8 0C10.1217 0 12.1566 0.842855 13.6569 2.34315C15.1571 3.84344 16 5.87827 16 8ZM10 5C10 5.53043 9.78929 6.03914 9.41421 6.41421C9.03914 6.78929 8.53043 7 8 7C7.46957 7 6.96086 6.78929 6.58579 6.41421C6.21071 6.03914 6 5.53043 6 5C6 4.46957 6.21071 3.96086 6.58579 3.58579C6.96086 3.21071 7.46957 3 8 3C8.53043 3 9.03914 3.21071 9.41421 3.58579C9.78929 3.96086 10 4.46957 10 5ZM8 9C7.0426 8.99981 6.10528 9.27449 5.29942 9.7914C4.49356 10.3083 3.85304 11.0457 3.454 11.916C4.01668 12.5706 4.71427 13.0958 5.49894 13.4555C6.28362 13.8152 7.13681 14.0009 8 14C8.86319 14.0009 9.71638 13.8152 10.5011 13.4555C11.2857 13.0958 11.9833 12.5706 12.546 11.916C12.147 11.0457 11.5064 10.3083 10.7006 9.7914C9.89472 9.27449 8.9574 8.99981 8 9Z"
                              fill="#90A4AE"
                            />
                          </svg>

                          <Typography variant="small" className="font-medium">
                            My Profile
                          </Typography>
                        </MenuItem>
                        <MenuItem
                          style={{ height: "50px" }}
                          onClick={() => navigate("/my-profile")}
                          className="text-black dark:text-luckyPoint-200 flex items-center gap-2"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M9.48999 1.17C9.10999 -0.39 6.88999 -0.39 6.50999 1.17C6.45326 1.40442 6.34198 1.62213 6.18522 1.80541C6.02845 1.9887 5.83063 2.13238 5.60784 2.22477C5.38505 2.31716 5.1436 2.35564 4.90313 2.33709C4.66266 2.31854 4.42997 2.24347 4.22399 2.118C2.85199 1.282 1.28199 2.852 2.11799 4.224C2.65799 5.11 2.17899 6.266 1.17099 6.511C-0.390006 6.89 -0.390006 9.111 1.17099 9.489C1.40547 9.54581 1.62322 9.65719 1.80651 9.81407C1.98979 9.97096 2.13343 10.1689 2.22573 10.3918C2.31803 10.6147 2.35639 10.8563 2.33766 11.0968C2.31894 11.3373 2.24367 11.5701 2.11799 11.776C1.28199 13.148 2.85199 14.718 4.22399 13.882C4.42993 13.7563 4.66265 13.6811 4.90318 13.6623C5.14371 13.6436 5.38527 13.682 5.60817 13.7743C5.83108 13.8666 6.02904 14.0102 6.18592 14.1935C6.34281 14.3768 6.45419 14.5945 6.51099 14.829C6.88999 16.39 9.11099 16.39 9.48899 14.829C9.54599 14.5946 9.65748 14.377 9.8144 14.1939C9.97132 14.0107 10.1692 13.8672 10.3921 13.7749C10.6149 13.6826 10.8564 13.6442 11.0969 13.6628C11.3373 13.6815 11.57 13.7565 11.776 13.882C13.148 14.718 14.718 13.148 13.882 11.776C13.7565 11.57 13.6815 11.3373 13.6628 11.0969C13.6442 10.8564 13.6826 10.6149 13.7749 10.3921C13.8672 10.1692 14.0107 9.97133 14.1939 9.81441C14.377 9.65749 14.5946 9.546 14.829 9.489C16.39 9.11 16.39 6.889 14.829 6.511C14.5945 6.45419 14.3768 6.34281 14.1935 6.18593C14.0102 6.02904 13.8666 5.83109 13.7743 5.60818C13.682 5.38527 13.6436 5.14372 13.6623 4.90318C13.681 4.66265 13.7563 4.42994 13.882 4.224C14.718 2.852 13.148 1.282 11.776 2.118C11.5701 2.24368 11.3373 2.31895 11.0968 2.33767C10.8563 2.35639 10.6147 2.31804 10.3918 2.22574C10.1689 2.13344 9.97095 1.9898 9.81407 1.80651C9.65718 1.62323 9.5458 1.40548 9.48899 1.171L9.48999 1.17ZM7.99999 11C8.79564 11 9.55871 10.6839 10.1213 10.1213C10.6839 9.55871 11 8.79565 11 8C11 7.20435 10.6839 6.44129 10.1213 5.87868C9.55871 5.31607 8.79564 5 7.99999 5C7.20434 5 6.44128 5.31607 5.87867 5.87868C5.31606 6.44129 4.99999 7.20435 4.99999 8C4.99999 8.79565 5.31606 9.55871 5.87867 10.1213C6.44128 10.6839 7.20434 11 7.99999 11Z"
                              fill="#90A4AE"
                            />
                          </svg>

                          <Typography variant="small" className="font-medium">
                            Edit Profile
                          </Typography>
                        </MenuItem>
                        <MenuItem
                          style={{ height: "50px" }}
                          onClick={() => navigate("/inbox")}
                          className="text-black dark:text-luckyPoint-200 flex items-center gap-2"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M2 0C1.46957 0 0.960859 0.210714 0.585786 0.585786C0.210714 0.960859 0 1.46957 0 2V12C0 12.5304 0.210714 13.0391 0.585786 13.4142C0.960859 13.7893 1.46957 14 2 14H12C12.5304 14 13.0391 13.7893 13.4142 13.4142C13.7893 13.0391 14 12.5304 14 12V2C14 1.46957 13.7893 0.960859 13.4142 0.585786C13.0391 0.210714 12.5304 0 12 0H2ZM2 2H12V9H10L9 11H5L4 9H2V2Z"
                              fill="#90A4AE"
                            />
                          </svg>

                          <Typography variant="small" className="font-medium">
                            Inbox
                          </Typography>
                        </MenuItem>
                        <MenuItem
                          style={{ height: "50px" }}
                          onClick={() => navigate("/help")}
                          className="text-black dark:text-luckyPoint-200 flex items-center gap-2"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M16 8C16 10.1217 15.1571 12.1566 13.6569 13.6569C12.1566 15.1571 10.1217 16 8 16C5.87827 16 3.84344 15.1571 2.34315 13.6569C0.842855 12.1566 0 10.1217 0 8C0 5.87827 0.842855 3.84344 2.34315 2.34315C3.84344 0.842855 5.87827 0 8 0C10.1217 0 12.1566 0.842855 13.6569 2.34315C15.1571 3.84344 16 5.87827 16 8ZM14 8C14 8.993 13.759 9.929 13.332 10.754L11.808 9.229C12.0362 8.52269 12.0632 7.76679 11.886 7.046L13.448 5.484C13.802 6.249 14 7.1 14 8ZM8.835 11.913L10.415 13.493C9.654 13.8281 8.83149 14.0007 8 14C7.13118 14.0011 6.27257 13.8127 5.484 13.448L7.046 11.886C7.63267 12.0298 8.24426 12.039 8.835 11.913ZM4.158 9.117C3.96121 8.4394 3.94707 7.72182 4.117 7.037L4.037 7.117L2.507 5.584C2.1718 6.34531 1.99913 7.16817 2 8C2 8.954 2.223 9.856 2.619 10.657L4.159 9.117H4.158ZM5.246 2.667C6.09722 2.22702 7.04179 1.99825 8 2C8.954 2 9.856 2.223 10.657 2.619L9.117 4.159C8.34926 3.93538 7.53214 3.94687 6.771 4.192L5.246 2.668V2.667ZM10 8C10 8.53043 9.78929 9.03914 9.41421 9.41421C9.03914 9.78929 8.53043 10 8 10C7.46957 10 6.96086 9.78929 6.58579 9.41421C6.21071 9.03914 6 8.53043 6 8C6 7.46957 6.21071 6.96086 6.58579 6.58579C6.96086 6.21071 7.46957 6 8 6C8.53043 6 9.03914 6.21071 9.41421 6.58579C9.78929 6.96086 10 7.46957 10 8Z"
                              fill="#90A4AE"
                            />
                          </svg>
                          <Typography variant="small" className="font-medium">
                            Help
                          </Typography>
                        </MenuItem>
                        <hr className="my-2 border-luckyPoint-50" />
                        <MenuItem
                          style={{ height: "50px" }}
                          onClick={handleLogout}
                          className="text-black dark:text-luckyPoint-200 flex items-center gap-2 "
                        >
                          <svg
                            width="16"
                            height="14"
                            viewBox="0 0 16 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M1 0C0.734784 0 0.48043 0.105357 0.292893 0.292893C0.105357 0.48043 0 0.734784 0 1V13C0 13.2652 0.105357 13.5196 0.292893 13.7071C0.48043 13.8946 0.734784 14 1 14C1.26522 14 1.51957 13.8946 1.70711 13.7071C1.89464 13.5196 2 13.2652 2 13V1C2 0.734784 1.89464 0.48043 1.70711 0.292893C1.51957 0.105357 1.26522 0 1 0ZM11.293 9.293C11.1108 9.4816 11.01 9.7342 11.0123 9.9964C11.0146 10.2586 11.1198 10.5094 11.3052 10.6948C11.4906 10.8802 11.7414 10.9854 12.0036 10.9877C12.2658 10.99 12.5184 10.8892 12.707 10.707L15.707 7.707C15.8945 7.51947 15.9998 7.26516 15.9998 7C15.9998 6.73484 15.8945 6.48053 15.707 6.293L12.707 3.293C12.6148 3.19749 12.5044 3.12131 12.3824 3.0689C12.2604 3.01649 12.1292 2.9889 11.9964 2.98775C11.8636 2.9866 11.7319 3.0119 11.609 3.06218C11.4861 3.11246 11.3745 3.18671 11.2806 3.2806C11.1867 3.3745 11.1125 3.48615 11.0622 3.60905C11.0119 3.73194 10.9866 3.86362 10.9877 3.9964C10.9889 4.12918 11.0165 4.2604 11.0689 4.3824C11.1213 4.50441 11.1975 4.61475 11.293 4.707L12.586 6H5C4.73478 6 4.48043 6.10536 4.29289 6.29289C4.10536 6.48043 4 6.73478 4 7C4 7.26522 4.10536 7.51957 4.29289 7.70711C4.48043 7.89464 4.73478 8 5 8H12.586L11.293 9.293Z"
                              fill="#90A4AE"
                            />
                          </svg>
                          <Typography variant="small" className="font-medium">
                            Sign Out
                          </Typography>
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </>
                ) : (
                  <div className="h-10 w-10 rounded-full border-2 border-luckyPoint-300 flex items-center justify-center">
                    <span className="text-xs">User</span>
                  </div>
                )}
                <span className="text-black dark:text-luckyPoint-200 text-sm font-medium">
                  {userData.name}
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Resize-bar (drag handle) inside the sidebar */}
        <div
          onMouseDown={handleMouseDownOnResizeBar}
          className=" w-1 absolute top-0 right-0 h-full bg-transparent opacity-50 hover:opacity-100 cursor-col-resize"
        ></div>
      </div>

      {isVideoModalOpen && (
        <Modal isToggled={isVideoModalOpen} onClose={closeVideoModal}>
          <VideoApp channelId={activeChannel} />
        </Modal>
      )}
    </>
  );
};

export default SideBar;
