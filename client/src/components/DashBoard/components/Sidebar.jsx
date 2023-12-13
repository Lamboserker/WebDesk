import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Modal from "../VideoModal";
import VideoApp from "../../Video/VideoApp";
import WorkspaceDropdown from "../Dropdown/WorkspaceDropdown";
import { useNavigate } from "react-router-dom";
import {
  PlusIcon,
  VideoCameraIcon,
  Bars3BottomLeftIcon,
} from "@heroicons/react/24/outline";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Typography,
} from "@material-tailwind/react";
import HoverComponent from "../Dropdown/UserDropdown";
import "../../styles/dashboard.css";
import { useWorkspaceModal } from "../../../Context/WorkspaceModalContext";

const SideBar = ({ activeChannel, setActiveChannel }) => {
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceDescription, setWorkspaceDescription] = useState("");
  const [isCreatingChannel, setIsCreatingChannel] = useState(false);
  const [channels, setChannels] = useState([]);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [userData, setUserData] = useState({ sender: "", senderImage: "" });
  const [members, setMembers] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(
    parseInt(localStorage.getItem("sidebarWidth")) || 200
  );
  const sidebarRef = useRef(null);

  const dividerStyle = "relative w-48 h-px bg-gray-400 my-4 mb-10";
  const MIN_SIDEBAR_WIDTH = 230; // Mindestbreite in Pixel
  let navigate = useNavigate();
  const { openModal } = useWorkspaceModal();

  const handleMouseDownOnResizeBar = (e) => {
    e.preventDefault();
    window.addEventListener("mousemove", onResize);
    window.addEventListener("mouseup", stopResizing);
  };
  const onResize = (e) => {
    let newWidth = e.clientX - sidebarRef.current.getBoundingClientRect().left;

    // Überprüfen, ob die neue Breite unter dem Mindestwert liegt
    newWidth = Math.max(newWidth, MIN_SIDEBAR_WIDTH);

    setSidebarWidth(newWidth);
    localStorage.setItem("sidebarWidth", newWidth.toString());
  };

  const stopResizing = () => {
    window.removeEventListener("mousemove", onResize);
    window.removeEventListener("mouseup", stopResizing);
  };

  const openVideoModal = () => {
    setIsVideoModalOpen(true);
  };

  const closeVideoModal = () => {
    setIsVideoModalOpen(false);
  };

  const closeWorkspaceModal = () => setIsWorkspaceModalOpen(false);

  const handleChannelClick = (channel) => {
    setActiveChannel(channel);
    if (window.innerWidth < 768) {
      setIsMobileSidebarOpen(false);
    }
  };

  const createWorkspace = () => {
    closeWorkspaceModal();
  };

  const openPopUp = () => {
    console.log("before", isDropdownOpen);
    setIsDropdownOpen(true);
    console.log("Is it open?", isDropdownOpen);
  };

  const handleDropdownClose = () => {
    setIsDropdownOpen(false);
    console.log("Is it open?", isDropdownOpen);
  };

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    const fetchWorkspaces = async () => {
      try {
        const response = await axios.get(
          "http://localhost:9000/api/workspaces/list",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const workspaces = response.data;

        if (workspaces.length === 1) {
          setSelectedWorkspace(workspaces[0]);
        } else {
          const lastVisitedWorkspaceId = localStorage.getItem(
            "lastVisitedWorkspace"
          );
          if (lastVisitedWorkspaceId) {
            const lastVisitedWorkspace = workspaces.find(
              (ws) => ws._id === lastVisitedWorkspaceId
            );
            setSelectedWorkspace(lastVisitedWorkspace || workspaces[0]);
          } else {
            setSelectedWorkspace(workspaces[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching workspaces:", error);
      }
    };

    fetchWorkspaces();
  }, []);

  useEffect(() => {
    if (selectedWorkspace && selectedWorkspace._id) {
      fetchChannels(selectedWorkspace._id);
      fetchWorkspaceMembers();
      localStorage.setItem("lastVisitedWorkspace", selectedWorkspace._id);
    }
  }, [selectedWorkspace]);

  // Fetch all channels from the server
  const fetchChannels = async (workspaceId) => {
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

  useEffect(() => {
    const lastVisitedWorkspaceId = localStorage.getItem("lastVisitedWorkspace");
    if (lastVisitedWorkspaceId) {
      setSelectedWorkspace({ _id: lastVisitedWorkspaceId });
    }
  }, []);

  useEffect(() => {
    if (selectedWorkspace && selectedWorkspace._id) {
      fetchChannels(selectedWorkspace._id);
      localStorage.setItem("lastVisitedWorkspace", selectedWorkspace._id);
    }
  }, [selectedWorkspace]);

  useEffect(() => {
    console.log("selectedWorkspace-Wert in useEffect:", selectedWorkspace);
    if (selectedWorkspace && selectedWorkspace._id) {
      fetchWorkspaceMembers();
    }
  }, [selectedWorkspace]);

  const fetchWorkspaceMembers = async () => {
    console.log("Aufruf von fetchWorkspaceMembers mit:", selectedWorkspace);
    if (!selectedWorkspace || !selectedWorkspace._id) {
      console.error("Kein ausgewählter Workspace oder Workspace ID fehlt.");
      return;
    }

    try {
      const token = localStorage.getItem("userToken");
      const workspaceId = selectedWorkspace._id;
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

  const handleCreateChannel = () => {
    setIsCreatingChannel(true);
  };

  const saveNewChannel = async () => {
    try {
      const token = localStorage.getItem("userToken");
      const workspaceId = selectedWorkspace._id;
      if (!workspaceId) {
        console.error("No workspace selected");
        return;
      }

      const response = await axios.post(
        `http://localhost:9000/api/workspaces/${workspaceId}/create-channel`,
        {
          name: newChannelName,
          workspaceId: workspaceId,
          messages: [],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Fügen Sie den neu erstellten Channel zum State hinzu
      setChannels((prevChannels) => [...prevChannels, response.data]);
      setIsCreatingChannel(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    // Remove the token from LocalStorage
    localStorage.removeItem("userToken");
    navigate("/");
  };

  // Function to handle workspace change
  const changeWorkspace = (workspace) => {
    setSelectedWorkspace(workspace);
    localStorage.setItem("lastVisitedWorkspaceId", workspace._id);
    fetchChannels(workspace._id);
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
          _id: userId, // Stellen Sie sicher, dass die ID hier gesetzt wird
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

  const navigateTo = (path) => {
    navigate(path);
  };

  const handleVideoCallClick = async (channelId) => {
    openVideoModal(channelId);
  };

  return (
    <>
      <div
        ref={sidebarRef}
        style={{ width: `${sidebarWidth}px` }}
        className={`relative flex flex-col justify-between h-full border-r-2 border-slate-900 ${
          isMobileSidebarOpen ? "block" : "hidden"
        } lg:block`}
      >
        {/* sidebar */}

        <div className="p-2 h-screen ">
          {/* Top Bar/Header */}
          <div
            className="flex items-center justify-between h-16 px-4 absolute top-0 left-0 lg:justify-start"
            onClick={openPopUp}
          >
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

          {/* Workspace-Name in der normalen Ansicht */}
          <div className="hidden lg:block lg:absolute top-0 left-0">
            <WorkspaceDropdown
              openModal={openModal}
              onSelectWorkspace={changeWorkspace}
              onClose={handleDropdownClose}
            />
          </div>

          {/* Primary Navigation */}
          <div className="flex flex-col px-4 mt-20">
            <button className="flex items-center py-2 text-sm  text-black font-medium hover:bg-gray-700 dark:hover:bg-gray-600 dark:text-white">
              Threads
            </button>
            <button className="flex items-center py-2 text-sm text-black font-medium hover:bg-gray-700 w-full text-left dark:hover:bg-gray-600 dark:text-white">
              Files
            </button>
            <button className="flex items-center py-2 text-sm text-black font-medium hover:bg-gray-700 dark:hover:bg-gray-600 dark:text-white">
              Mentions & reactions
            </button>
            {/* ... more primary navigation items */}
          </div>

          {/* Channels Section */}
          <div className="px-4 mt-2 relative overflow-y-auto max-h-72">
            <div className={dividerStyle}></div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xs font-semibold text-black uppercase  dark:text-white">
                Channels
              </h2>
              <button
                onClick={handleCreateChannel}
                className="hover:bg-gray-700 rounded"
              >
                <PlusIcon className="h-5 w-5 text-black dark:text-white" />
              </button>
            </div>
            {/* Dialog oder Formular für neue Channel-Erstellung */}
            {isCreatingChannel && (
              <div className="w-40">
                <div className="relative w-full min-w-[200px] h-10">
                  <input
                    className=" peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-200"
                    placeholder=""
                    type="text"
                    value={newChannelName}
                    onChange={(e) => setNewChannelName(e.target.value)}
                  />{" "}
                  <label className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-gray-500 peer-focus:text-gray-200 before:border-blue-gray-200 peer-focus:before:!border-gray-200 after:border-blue-gray-200 peer-focus:after:!border-gray-200">
                    channel name
                  </label>
                </div>
                <button
                  className="text-black dark:text-white"
                  onClick={saveNewChannel}
                >
                  create channel
                </button>
              </div>
            )}

            {/* List of channels */}
            {channels.map((channel) => (
              <div
                key={channel._id}
                className="flex items-center justify-between py-2 text-sm text-black font-medium hover:bg-gray-700 dark:text-white"
              >
                <button onClick={() => handleChannelClick(channel._id)}>
                  # {channel.name}
                </button>
                <button onClick={() => handleVideoCallClick(channel._id)}>
                  <VideoCameraIcon className="h-5 w-5 text-black dark:text-white" />
                </button>
              </div>
            ))}
            <div className={dividerStyle}></div>
          </div>
          {/* Direct Messages Section */}
          <div className="px-4 mt-2 relative overflow-y-auto  max-h-72">
            <h2 className="text-xs font-semibold text-black dark:text-white uppercase mb-5">
              Direct Messages
            </h2>

            <div className="space-y-1">
              {members.map((member, index) => {
                if (member._id !== userData._id) {
                  return (
                    <HoverComponent key={index} userId={member._id}>
                      <button
                        key={index}
                        className="flex items-center py-2 text-sm text-black dark:text-white font-medium hover:bg-gray-700 w-full text-left"
                      >
                        <img
                          src={
                            `http://localhost:9000/${member.profileImage}` ||
                            member.profileImage ||
                            "https://img.freepik.com/premium-vector/social-media-user-profile-icon-video-call-screen_97886-10046.jpg"
                          }
                          alt="Profile"
                          className="rounded-full w-6 h-6 mr-2"
                        />
                        {member.name}
                      </button>
                    </HoverComponent>
                  );
                }
                return null; // Nichts rendern, wenn es der eigene Account ist
              })}
            </div>
            <div className={dividerStyle}></div>
          </div>
          {/* Secondary Navigation/Footer */}
          <div className="px-4 mt-2  absolute bottom-0">
            <button className="flex items-center py-2 text-sm text-black dark:text-white font-medium hover:bg-gray-700 w-full text-left">
              Preferences
            </button>
            <button className="flex items-center py-2 text-sm text-black dark:text-white font-medium hover:bg-gray-700 w-full text-left">
              Help
            </button>
            <div className={dividerStyle}></div>

            {/* User Profile Section */}
            <div className="  py-5 mt-auto relative bottom-0 left-0">
              <div className="flex items-center space-x-3">
                {!imageLoadError && userData.profileImage ? (
                  <>
                    <Menu>
                      <MenuHandler>
                        <Avatar
                          variant="circular"
                          alt="User"
                          className="cursor-pointer h-10 w-10 rounded-full border-2 border-gray-300 object-cover"
                          src={`http://localhost:9000/${userData.profileImage}`}
                        />
                      </MenuHandler>
                      <MenuList className="bg-white dark:bg-gray-700">
                        <MenuItem
                          style={{ height: "50px" }}
                          onClick={() => navigate("/my-profile")}
                          className="flex items-center gap-2 text-black dark:text-white "
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
                          onClick={() => navigate("/profile-settings")}
                          className="text-black dark:text-white flex items-center gap-2"
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
                          className="text-black dark:text-white flex items-center gap-2"
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
                          className="text-black dark:text-white flex items-center gap-2"
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
                        <hr className="my-2 border-blue-gray-50" />
                        <MenuItem
                          style={{ height: "50px" }}
                          onClick={handleLogout}
                          className="text-black dark:text-white flex items-center gap-2 "
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
                  <div className="h-10 w-10 rounded-full border-2 border-gray-300 flex items-center justify-center">
                    <span className="text-xs">User</span>
                  </div>
                )}
                <span className="text-black dark:text-white text-sm font-medium">
                  {userData.name}
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Resize-Bar (Drag Handle) innerhalb der Sidebar */}
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