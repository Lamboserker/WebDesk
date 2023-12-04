import React, { useState, useRef, useEffect, useCallback, Link } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import "../styles/dashboard.css";
import {
  PlusIcon,
  PaperAirplaneIcon,
  EllipsisVerticalIcon,
  MagnifyingGlassIcon,
  VideoCameraIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Typography,
} from "@material-tailwind/react";
import Picker from "emoji-picker-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // import styles
import Modal from "./VideoModal";
import VideoApp from "../Video/VideoApp";
import { modules, formats } from "./index";
import axios from "axios";
import WorkspaceDropdown from "./Dropdown/WorkspaceDropdown";
import "react-quill/dist/quill.snow.css";
import ProfileInfoPopover from "../userProfile/ProfileMenu";
const socket = io("http://localhost:9000"); // URL Ihres Socket.IO-Servers

const Dashboard = () => {
  let navigate = useNavigate();
  const [activeChannel, setActiveChannel] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [showMenu] = useState(false);
  const [channels, setChannels] = useState([]);
  const [newChannelName, setNewChannelName] = useState("");
  const [isCreatingChannel, setIsCreatingChannel] = useState(false);
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceDescription, setWorkspaceDescription] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [, setIsMenuOpen] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [userData, setUserData] = useState({ sender: "", senderImage: "" });
  const [imageLoadError, setImageLoadError] = useState(false);
  const [members, setMembers] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [isProfilePopoverOpen, setIsProfilePopoverOpen] = useState(false);
  const menuRef = useRef();
  const messageInputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const dropdownRef = useRef(null);
  const messagesEndRef = useRef(null);
  const dividerStyle = "relative w-60 h-px bg-gray-400 my-4";

  const openProfilePopover = () => setIsProfilePopoverOpen(true);
  const closeProfilePopover = () => setIsProfilePopoverOpen(false);

  const onEmojiClick = (emojiObject) => {
    if (messageInputRef.current) {
      const quill = messageInputRef.current.getEditor();
      const range = quill.getSelection(true); // Get the current selection
      const position = range ? range.index : quill.getLength(); // Position to insert emoji
      quill.insertText(position, emojiObject.emoji); // Insert emoji at the position
      quill.setSelection(position + emojiObject.emoji.length); // Move cursor after the emoji
    }
  };

  // Click outside the emoji picker handle to close it
  useEffect(() => {
    const handleClickOutsideEmoji = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideEmoji);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideEmoji);
    };
  }, []);

  const openVideoModal = () => {
    setIsVideoModalOpen(true);
  };

  const closeVideoModal = () => {
    setIsVideoModalOpen(false);
  };

  const closeWorkspaceModal = () => setIsWorkspaceModalOpen(false);
  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const handleChannelClick = (channelId) => {
    setActiveChannel(channelId);
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

  const handleCreateChannel = () => {
    setIsCreatingChannel(true);
  };

  const saveNewChannel = async () => {
    try {
      const token = localStorage.getItem("userToken");
      const workspaceId = selectedWorkspace._id;
      // console.log(selectedWorkspace._id);
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
      // console.log(response.data);
      await fetchChannels();
    } catch (error) {
      console.error(error);
    }
  };
  const handleLogout = () => {
    // Remove the token from LocalStorage
    localStorage.removeItem("userToken");
    navigate("/");
  };

  // function to close menu
  const closeMenu = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsMenuOpen(false);
    }
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
        const response = await axios.get("http://localhost:9000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
          params: { userId: userId },
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

  // Aktualisierte fetchMessages Funktion
  const fetchMessages = useCallback(async () => {
    try {
      const channelId = activeChannel;
      const response = await axios.get(
        `http://localhost:9000/api/messages/${channelId}/messages`
      );
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, [activeChannel]);

  useEffect(() => {
    if (activeChannel) {
      socket.emit("joinChannel", { channelId: activeChannel });
      fetchMessages();

      socket.on("newMessage", (newMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });
    }

    return () => {
      socket.off("newMessage");
    };
  }, [activeChannel, fetchMessages]);

  // Function to decode messages
  function Message({ htmlContent }) {
    return (
      <div
        dangerouslySetInnerHTML={{ __html: htmlContent }}
        className="text-white"
      />
    );
  }

  // Neue sendMessage Funktion
  const sendMessage = useCallback(() => {
    const senderImage = userData.profileImage ? userData.profileImage : null;
    if (message && activeChannel) {
      console.log("image is: ", userData.profileImage);
      socket.emit("sendMessage", {
        channelId: activeChannel,
        content: message,
        sender: userData.name,
        senderImage: senderImage,
      });
      setMessage("");
    }
  }, [message, activeChannel, userData.name, userData.profileImage]);

  const handleSendMessage = async (event) => {
    event.preventDefault();
    if (message) {
      sendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleTyping = (event) => {
    // Sendet ein Socket.IO-Event, wenn der Benutzer tippt
    socket.emit("userTyping", activeChannel);
    // Weitere Logik ...
  };

  useEffect(() => {
    socket.on("userIsTyping", () => {
      setIsTyping(true);
    });
    socket.on("userStoppedTyping", () => {
      setIsTyping(false);
    });
    // Clean-up
    return () => {
      socket.off("userIsTyping");
      socket.off("userStoppedTyping");
    };
  }, []);

  const navigateToUserProfile = () => {
    navigate("/user-profile");
  };

  const htmlToText = (html) => {
    // Erstellen eines neuen DOM-Elements und Einfügen des HTML-Inhalts
    const tempDivElement = document.createElement("div");
    tempDivElement.innerHTML = html;
    // Rückgabe des Textinhalts, HTML-Tags werden entfernt
    return tempDivElement.textContent || tempDivElement.innerText || "";
  };

  // Filterfunktion, um Nachrichten basierend auf dem Suchbegriff zu filtern
  const filterMessages = useCallback(() => {
    console.log("Suchbegriff:", searchTerm);

    if (!searchTerm) {
      setFilteredMessages(messages);
    } else {
      const filtered = messages.filter((message) =>
        htmlToText(message.content)
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
      setFilteredMessages(filtered);
    }
  }, [messages, searchTerm]);

  useEffect(() => {
    console.log("Aktuelle Nachrichten:", messages);
    filterMessages();
  }, [searchTerm, messages, filterMessages]);

  // Entscheiden, welche Nachrichten angezeigt werden sollen
  const displayedMessages = searchTerm ? filteredMessages : messages;

  return (
    <>
      <div
        className={`flex h-screen bg-gradient-to-r from-gray-800 to-violet-900 ${
          isDropdownOpen ? "blur-md" : ""
        }`}
      >
        {/* sidebar */}
        <div className="flex flex-col  text-white w-64 mt-16  ">
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
            <button className="flex items-center py-2 text-sm font-medium hover:bg-gray-700 w-full text-left">
              Files
            </button>
            <button className="flex items-center py-2 text-sm font-medium hover:bg-gray-700">
              Mentions & reactions
            </button>
            {/* ... more primary navigation items */}
          </div>

          {/* Channels Section */}
          <div className="px-4 mt-2 relative">
            <div className={dividerStyle}></div>
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold text-gray-500 uppercase z-auto mb-5">
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
                className="flex items-center justify-between py-2 text-sm font-medium hover:bg-gray-700"
              >
                <button onClick={() => handleChannelClick(channel._id)}>
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
          <div className="px-4  mt-24">
            <div className={dividerStyle}></div>
            <h2 className="text-xs font-semibold text-gray-500 uppercase mb-2">
              Direct Messages
            </h2>
            {/* List of DMs */}
            <div className="space-y-1">
              {members.map((member, index) => (
                <button
                  key={index}
                  className="flex items-center py-2 text-sm font-medium hover:bg-gray-700 w-full text-left"
                >
                  {member.name}{" "}
                </button>
              ))}
            </div>
          </div>

          {/* Secondary Navigation/Footer */}
          <div className="px-4  space-y-1 mt-48">
            <div className={dividerStyle}></div>
            <button className="flex items-center py-2 text-sm font-medium hover:bg-gray-700 w-full text-left">
              Preferences
            </button>
            <button className="flex items-center py-2 text-sm font-medium hover:bg-gray-700 w-full text-left">
              Help
            </button>
          </div>
          {/* User Profile Section */}
          <div className="mt-auto px-4 py-2">
            <div className="flex items-center space-x-3">
              {!imageLoadError && userData.profileImage ? (
                <img
                  src={userData.profileImage}
                  alt="Profile"
                  className="h-10 w-10 rounded-full border-2 border-gray-300 object-cover"
                  onClick={openProfilePopover}
                  onError={() => setImageLoadError(true)}
                />
              ) : (
                <div
                  className="h-10 w-10 rounded-full border-2 border-gray-300 flex items-center justify-center"
                  onClick={openProfilePopover}
                >
                  <span className="text-xs">User</span>
                </div>
              )}
              <span
                onClick={openProfilePopover}
                className="text-sm font-medium"
              >
                {userData.name}
              </span>
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
              className="pl-10 pr-8 py-2 rounded w-full"
              type="text"
              placeholder="Nachrichten suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
                <button
                  className="p-2 hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* chat history/main area */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-700">
            <h2 className="font-bold mb-2">
              {activeChannel ? `#${activeChannel}` : "Please choose a channel"}
            </h2>
            <div className="space-y-4">
              {displayedMessages && displayedMessages.length > 0 ? (
                displayedMessages.map((message) => {
                  // Überprüfen, ob message.senderName und message.senderImage vorhanden sind
                  const userData = {
                    senderName: message?.senderName
                      ? message.senderName
                      : "Loading...",
                    senderImage: message?.senderImage
                      ? message.senderImage
                      : "https://img.freepik.com/premium-vector/social-media-user-profile-icon-video-call-screen_97886-10046.jpg",
                  };

                  return (
                    <div
                      key={message._id}
                      className="flex items-start space-x-2"
                    >
                      <img
                        src={userData.senderImage}
                        alt={userData.sender}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-baseline justify-between">
                          <p className="font-semibold text-white">
                            {message.sender}
                          </p>
                          <span className="text-xs text-white">
                            {new Date(message.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                        <Message htmlContent={message.content} />
                        <div ref={messagesEndRef} />
                      </div>
                    </div>
                  );
                })
              ) : (
                <p>Keine Nachrichten gefunden</p>
              )}
            </div>
          </div>
          {/* message input area */}
          {activeChannel && (
            <div className="p-4 bg-transparent shadow-md flex flex-col custom-quill">
              <ReactQuill
                onChange={(value) => setMessage(value)}
                ref={messageInputRef}
                value={message}
                modules={modules}
                formats={formats}
              />

              {/* Message Input with Emoji Picker */}
              <div className="flex items-center p-2 rounded-b-lg justify-end">
                <button
                  className="text-gray-500 mx-1 z-50"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  style={{ fontSize: "24px" }}
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
                  <button
                    className="text-gray-500 mx-1 mt-1 z-50"
                    onClick={sendMessage}
                  >
                    <EllipsisVerticalIcon className="h-6" />
                  </button>
                  {showMenu && (
                    <div className="dropdown-menu z-50">
                      {/* Menüoptionen */}
                      <a
                        href="/"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        Option 1
                      </a>
                      {/* Weitere Optionen */}
                    </div>
                  )}
                </div>
                <button
                  onClick={handleSendMessage}
                  className="ml-2 text-gray-700 rounded-lg  z-50"
                >
                  <PaperAirplaneIcon className="h-6 mx-1" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Top Bar/Header */}
      <div
        className="flex items-center justify-between h-16 px-4 shadow-md absolute top-0 left-0 z-50"
        onClick={openPopUp}
      >
        {/* Workspace Dropdown */}
        <WorkspaceDropdown
          onSelectWorkspace={changeWorkspace}
          onClose={handleDropdownClose}
          className="z-50"
        />
        <div className="absolute left-0  bg-transparent  rounded-md shadow-md flex flex-col">
          {/* Andere Menüpunkte */}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
