import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";
import {
  PlusIcon,
  PaperAirplaneIcon,
  EllipsisVerticalIcon,
  MagnifyingGlassIcon,
  VideoCameraIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import Picker from "emoji-picker-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // import styles
import Modal from "./VideoModal";
import VideoApp from "../Video/VideoApp";
import { modules, formats } from "./index";
import axios from "axios";
import WorkspaceDropdown from "./Dropdown/WorkspaceDropdown";
const Dashboard = () => {
  let navigate = useNavigate();
  const [activeChannel, setActiveChannel] = useState(null);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [channels, setChannels] = useState([]);
  const [newChannelName, setNewChannelName] = useState("");
  const [isCreatingChannel, setIsCreatingChannel] = useState(false);
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceDescription, setWorkspaceDescription] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [, setIsMenuOpen] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [, setUsers] = useState([]);
  const [, setMessages] = useState([]);
  const [selectedChannel] = useState(null);
  const [workspaces, setWorkspaces] = useState([]);
  const [userData, setUserData] = useState({ name: "", profileImage: "" });
  const [imageLoadError, setImageLoadError] = useState(false);
  const menuRef = useRef();
  const messageInputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const dropdownRef = useRef(null);

  const closeWorkspaceModal = () => setIsWorkspaceModalOpen(false);
  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const setActiveChannelFunction = (channel) => {
    setActiveChannel(channel);
  };

  const handleChannelClick = (channel) => {
    setActiveChannel(channel);
  };

  const createWorkspace = () => {
    closeWorkspaceModal();
  };

  // function to create a new channel
  const createChannel = async (channelName, selectedWorkspace) => {
    const token = localStorage.getItem("userToken"); // Token aus dem localStorage

    try {
      const response = await axios.post(
        `http://localhost:9000/api/workspaces/create-channel`,
        {
          name: channelName,
          workspace: selectedWorkspace._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Verarbeiten der Antwort
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const onEmojiClick = (emojiObject) => {
    if (messageInputRef.current) {
      const quill = messageInputRef.current.getEditor();
      const range = quill.getSelection(true); // Get the current selection
      const position = range ? range.index : quill.getLength(); // Position to insert emoji
      quill.insertText(position, emojiObject.emoji); // Insert emoji at the position
      quill.setSelection(position + emojiObject.emoji.length); // Move cursor after the emoji
    }
  };

  const handleMessageSend = () => {
    if (messageInputRef.current) {
      const messageContent = messageInputRef.current.getEditor().getText();
      console.log("message sent:", messageContent);
      // Add logic to send the message
      messageInputRef.current.getEditor().deleteText(0, messageContent.length); // Clear the field after sending
    }
  };

  // Click outside the emoji picker handle to close it

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleClickOutside = (event) => {
    if (
      emojiPickerRef.current &&
      !emojiPickerRef.current.contains(event.target)
    ) {
      setShowEmojiPicker(false);
    }
  };

  const openVideoModal = () => {
    setIsVideoModalOpen(true);
  };

  const closeVideoModal = () => {
    setIsVideoModalOpen(false);
  };

  // Add event listener for clicks outside
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const token = localStorage.getItem("userToken"); // Holt den Token aus dem Local Storage
        const response = await axios.get(
          "http://localhost:9000/api/workspaces/channels",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setChannels(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchChannels();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    // Event Listener hinzufügen
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup-Funktion
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCreateChannel = () => {
    setIsCreatingChannel(true);
  };

  const saveNewChannel = async () => {
    try {
      const token = localStorage.getItem("userToken"); // Token aus dem localStorage
      const workspaceId = selectedWorkspace._id; // Use the ID of the selected workspace
      console.log(selectedWorkspace._id);
      if (!workspaceId) {
        console.error("No workspace selected");
        return;
      }

      const response = await axios.post(
        `http://localhost:9000/api/workspaces/create-channel`,
        {
          name: newChannelName,
          workspaceId: workspaceId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    // Remove the token from LocalStorage
    localStorage.removeItem("token"); // Replace 'token' with your token's key

    // Redirect to the login/landing page
    navigate("/"); // Replace '/login' with your login or landing page path
  };

  // Funktion zum Schließen des Menüs
  const closeMenu = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsMenuOpen(false);
    }
  };

  // Event Listener zum Schließen des Menüs bei Klick außerhalb
  useEffect(() => {
    document.addEventListener("mousedown", closeMenu);
    return () => {
      document.removeEventListener("mousedown", closeMenu);
    };
  }, []);

  // Fetch workspaces

  const fetchWorkspaces = async () => {
    const token = localStorage.getItem("userToken");
    try {
      const response = await axios.get(
        "http://localhost:9000/api/workspaces/list",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setWorkspaces(response.data);
      // Auto-select if there is only one workspace
      if (response.data.length === 1) {
        setSelectedWorkspace(response.data[0]);
      }
    } catch (error) {
      console.error("Error fetching workspaces:", error);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  // fetch channels
  useEffect(() => {
    axios
      .get("http://localhost:9000/api/workspaces/workspaceChannels")
      .then((response) => setChannels(response.data))
      .catch((error) => console.error(error));
  }, []);

  // Fetch users
  useEffect(() => {
    if (selectedWorkspace) {
      const token = localStorage.getItem("userToken");
      const workspaceId = workspaces._id;
      axios
        .get(`http://localhost:9000/api/workspaces/users`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => setUsers(response.data))
        .catch((error) => console.error(error));
    }
  }, [selectedWorkspace]);

  // fetch user information
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("userToken");
        const response = await axios.get("http://localhost:9000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData({
          name: response.data.name,
          profileImage: response.data.profileImage,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  // Fetch messages
  useEffect(() => {
    if (selectedChannel) {
      axios
        .get(`/channel/${selectedChannel}/messages`)
        .then((response) => setMessages(response.data))
        .catch((error) => console.error(error));
    }
  }, [selectedChannel]);

  const handleChangeWorkspace = (event) => {
    setSelectedWorkspace(event.target.value);
  };

  // Load last visited workspace on user login
  useEffect(() => {
    const lastVisitedWorkspaceId = localStorage.getItem(
      "lastVisitedWorkspaceId"
    );
    if (lastVisitedWorkspaceId) {
      // Fetch the workspace details including its channels
      // Set the first channel of this workspace as activeChannel
      // ... Fetching logic here
      setSelectedWorkspace(lastVisitedWorkspaceId);
    }
  }, []);

  // Function to handle workspace change
  const changeWorkspace = async (workspaceId) => {
    try {
      const response = await axios.get(
        `http://localhost:9000/api/workspaces/isInWorkspace`
      );
      if (
        response.data &&
        response.data.channels &&
        response.data.channels.length > 0
      ) {
        setActiveChannelFunction(response.data.channels[0]);
      }
      setSelectedWorkspace(workspaceId);
      localStorage.setItem("lastVisitedWorkspaceId", workspaceId);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error changing workspace:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-900 to-gray-900">
      {/* sidebar */}
      <div className="flex flex-col  text-white w-64">
        {/* Top Bar/Header */}
        <div className="flex items-center justify-between h-16 px-4 shadow-md">
          <div className="absolute left-0 mt-2 w-56 bg-black  rounded-md shadow-md flex flex-col">
            {/* Workspace Dropdown */}
            <WorkspaceDropdown onSelectWorkspace={changeWorkspace} />

            {/* Andere Menüpunkte */}

            <button className="p-2 hover:bg-gray-700" onClick={changeWorkspace}>
              Change Workspace
            </button>
          </div>
        </div>
        {isWorkspaceModalOpen && (
          <div className="workspace-modal">
            <div className="workspace-modal-content">
              <input
                type="text"
                placeholder="Workspace Name"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
              />
              <textarea
                placeholder="Workspace Description"
                value={workspaceDescription}
                onChange={(e) => setWorkspaceDescription(e.target.value)}
              />
              <button onClick={createWorkspace}>Create Workspace</button>
              <button onClick={closeWorkspaceModal}>Close</button>
            </div>
          </div>
        )}
        {/* Primary Navigation */}
        <div className="flex flex-col px-4 mt-2">
          <button className="flex items-center py-2 text-sm font-medium hover:bg-gray-700">
            Threads
          </button>
          <button className="flex items-center py-2 text-sm font-medium hover:bg-gray-700">
            All DMs
          </button>
          <button className="flex items-center py-2 text-sm font-medium hover:bg-gray-700">
            Mentions & reactions
          </button>
          {/* ... more primary navigation items */}
        </div>

        {/* Channels Section */}
        <div className="px-4 mt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold text-gray-500 uppercase">
              Channels
            </h2>
            <button
              onClick={handleCreateChannel}
              className="hover:bg-gray-700 rounded"
            >
              <PlusIcon className="h-5 w-5 text-white" />
            </button>
          </div>

          {/* Dialog oder Formular für neue Channel-Erstellung */}
          {isCreatingChannel && (
            <div>
              <input
                className="text-black"
                type="text"
                value={newChannelName}
                onChange={(e) => setNewChannelName(e.target.value)}
              />
              <button onClick={saveNewChannel}>Channel erstellen</button>
            </div>
          )}

          {/* List of channels */}
          {channels.map((channel) => (
            <div
              key={channel._id}
              className="flex items-center py-2 text-sm font-medium hover:bg-gray-700"
            >
              {channel.name}
              <button onClick={() => handleChannelClick(channel)}>
                # {channel.name}
              </button>
              <button onClick={openVideoModal}>
                <VideoCameraIcon className="h-5 w-5 text-white" />
              </button>
            </div>
          ))}
        </div>

        {isVideoModalOpen && (
          <Modal isToggled={isVideoModalOpen} onClose={closeVideoModal}>
            <VideoApp />
          </Modal>
        )}
        {/* Direct Messages Section */}
        <div className="px-4 mt-2">
          <h2 className="text-xs font-semibold text-gray-500 uppercase">
            Direct Messages
          </h2>
          {/* List of DMs */}
          <div className="mt-1">
            <button className="flex items-center py-2 text-sm font-medium hover:bg-gray-700">
              User 1
            </button>
            <button className="flex items-center py-2 text-sm font-medium hover:bg-gray-700">
              User 2
            </button>
            {/* ... more DMs */}
          </div>
        </div>

        {/* Secondary Navigation/Footer */}
        <div className="px-4 mt-2">
          <button className="flex items-center py-2 text-sm font-medium hover:bg-gray-700">
            Files
          </button>
          <button className="flex items-center py-2 text-sm font-medium hover:bg-gray-700">
            Preferences
          </button>
          <button className="flex items-center py-2 text-sm font-medium hover:bg-gray-700">
            Help
          </button>
        </div>
        {/* User Profile Section */}
        <div className="mt-auto px-4 py-2">
          <div className="flex items-center space-x-3">
            {!imageLoadError ? (
              <img
                src={userData.profileImage}
                alt="Profile"
                className="h-10 w-10 rounded-full border-2 border-gray-300 object-cover"
                onError={() => setImageLoadError(true)}
              />
            ) : (
              <div className="h-10 w-10 rounded-full border-2 border-gray-300 flex items-center justify-center">
                <span className="text-xs">User</span>
              </div>
            )}
            <span className="text-sm font-medium">{userData.name}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1">
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

        {/* chat history/ main area */}
        <div className="flex-1 p-4 overflow-y-auto bg-white">
          <h2 className="font-bold mb-2">
            {activeChannel ? `#${activeChannel}` : "please choose a channel"}
          </h2>
          <div className="space-y-4">
            {activeChannel &&
              message[activeChannel].map((msg, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <img
                    src="/path/to/avatar.png"
                    alt="Avatar"
                    className="w-10 h-10 rounded-full"
                  />{" "}
                  {/* Avatar */}
                  <div className="flex-1">
                    <div className="flex items-baseline justify-between">
                      <p className="font-semibold">username</p> {/* username */}
                      <span className="text-xs text-gray-500">12:00</span>{" "}
                      {/* time */}
                    </div>
                    <p>{msg}</p> {/* message text */}
                  </div>
                </div>
              ))}
          </div>
        </div>
        {/* message input area */}
        {activeChannel && (
          <div className="p-4 bg-transparent shadow-md flex flex-col custom-quill">
            <ReactQuill
              ref={messageInputRef}
              value={message}
              onChange={setMessage}
              modules={modules}
              formats={formats}
            />

            {/* Message Input with Emoji Picker */}
            <div className="flex items-center p-2 rounded-b-lg justify-end">
              {" "}
              {/* Adjust this line */}
              <button
                className="text-gray-500 mx-1 z-50"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                style={{ fontSize: "24px" }} // Adjusting the size of emoji icon
              >
                <span role="img" aria-label="emoji">
                  🙂
                </span>
              </button>
              {showEmojiPicker && (
                <div
                  ref={emojiPickerRef}
                  className="absolute bottom-16 right-5"
                >
                  <Picker onEmojiClick={onEmojiClick} />
                </div>
              )}
              <div className="menu-container">
                <button className="text-gray-500" onClick={toggleMenu}>
                  <EllipsisVerticalIcon className="h-5 w-5" />
                </button>
                {showMenu && (
                  <div className="dropdown-menu z-50">
                    {
                      <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                        <div
                          className="py-1"
                          role="menu"
                          aria-orientation="vertical"
                          aria-labelledby="options-menu"
                        >
                          {/* Menüoptionen hier */}
                          <a
                            href="/"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            role="menuitem"
                          >
                            Option 1
                          </a>
                          {/* Weitere Optionen */}
                        </div>
                      </div>
                    }
                  </div>
                )}
              </div>
              <button
                onClick={handleMessageSend}
                className="ml-2 text-gray-700 rounded-lg p-2 z-50"
                style={{ fontSize: "24px" }} // Adjusting the size of send icon
              >
                <PaperAirplaneIcon className="h-6 w-6" />{" "}
                {/* Adjusting the size */}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
