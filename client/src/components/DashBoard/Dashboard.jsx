import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate  } from "react-router-dom";
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [workspaces, setWorkspaces] = useState([]);
  const menuRef = useRef();
  const messageInputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const openWorkspaceModal = () => setIsWorkspaceModalOpen(true);
  const closeWorkspaceModal = () => setIsWorkspaceModalOpen(false);
  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const handleChannelClick = (channel) => {
    setActiveChannel(channel);
  };

  const createWorkspace = () => {
    closeWorkspaceModal();
  };

  const createChannel = async (channelName) => {
    const token = localStorage.getItem("userToken"); // Token aus dem localStorage

    try {
      const response = await axios.post(
        "http://localhost:9000/api/channels/create-channel",
        {
          name: channelName,
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
          "http://localhost:9000/api/channels/channel",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(response.data); // Verarbeiten Sie die Channel-Daten
      } catch (error) {
        console.error(error);
      }
    };

    fetchChannels();
  }, []);

  const handleCreateChannel = () => {
    setIsCreatingChannel(true);
  };

  const saveNewChannel = () => {
    try {
      const token = localStorage.getItem("userToken"); // Token aus dem localStorage
      const workspaceId = activeChannel.workspaceId;
       const response = axios.post("http://localhost:9000/api/channels/create-channel",
        {
          name: newChannelName,
          workspaceId: activeChannel.workspaceId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    } catch (error) {
        console.error(error);
      }}
  const handleLogout = () => {
    // Remove the token from LocalStorage
    localStorage.removeItem('token'); // Replace 'token' with your token's key

    // Redirect to the login/landing page
    navigate('/'); // Replace '/login' with your login or landing page path
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

  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-900 to-gray-900">
      {/* sidebar */}
      <div className="flex flex-col  text-white w-64">
        {/* Top Bar/Header */}
        <div className="flex items-center justify-between h-16 px-4 shadow-md">
          <h1 className="text-lg font-bold">
            <Link to="/">WebDesk</Link>
          </h1>
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
          {/* Dialog oder Formular für neue Channel-Erstellung*/}
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
                # {channel}
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
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Searchbar */}
        <div className="p-4 flex items-center">
          <MagnifyingGlassIcon className="h-5 w-5 text-white mr-2" />
          <input
            type="text"
            className="p-2 rounded w-11/12" // Adjust width class as needed
            placeholder="Nachrichten suchen"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
           {/*hamburger menu */}

        <Bars3Icon className="w-4 " onClick={toggleDropdown} />
      
      {showDropdown && (
        <div ref={menuRef} className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-md">
          {/* Add menu items here */}
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
        </div>
        
       

        {/* chat history/ main area */}
        <div className="flex-1 p-4 overflow-y-auto bg-white">
          <h2 className="font-bold mb-2">
            {activeChannel ? `#${activeChannel}` : "Wählen Sie einen Kanal"}
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
