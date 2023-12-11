import React, { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import {
  PaperAirplaneIcon,
  EllipsisVerticalIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import Picker from "emoji-picker-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { modules, formats } from "../index";
import Switcher from "../../../Switcher";
import '../../styles/dashboard.css';



const Maincontent = ({ activeChannel }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userData, setUserData] = useState({ sender: "", senderImage: "" });
  const [message, setMessage] = useState("");
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const dropdownRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const messageInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [showMenu] = useState(false);

  const socket = io("http://localhost:9000"); // URL Ihres Socket.IO-Servers
  const navigate = useNavigate();
  const toggleDropdown = () => setShowDropdown(!showDropdown);

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
      className="text-black dark:text-white"
    />
  );
}

const htmlToText = (html) => {
  const tempDivElement = document.createElement("div");
  tempDivElement.innerHTML = html;
  return tempDivElement.textContent || tempDivElement.innerText || "";
};

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
}, [message, activeChannel, userData.name, userData.profileImage, socket]);

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

  const displayedMessages = searchTerm ? filteredMessages : messages;

  const navigateTo = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    // Remove the token from LocalStorage
    localStorage.removeItem("userToken");
    navigate("/");
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
}, [activeChannel, messages, searchTerm]);

  useEffect(() => {
    const lastVisitedWorkspaceId = localStorage.getItem("lastVisitedWorkspace");
    if (lastVisitedWorkspaceId) {
      setSelectedWorkspace({ _id: lastVisitedWorkspaceId });
    }
  }, []);

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
  return (
    <>
      {/* Main Content */}
      <div className="flex flex-col flex-1 h-full overflow-y-scroll">
        {/* Searchbar */}
        <div className="relative p-4  items-center lg:block hidden">
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
              className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-700 rounded-md shadow-md flex flex-col"
            >
              {/* Add menu items here */}
              <button
                className=" text-black dark:text-white p-2 hover:bg-gray-100"
                onClick={handleLogout}
              >
                Logout
              </button>
              <button className="bg-white dark:bg-gray-700 p-2 hover:bg-gray-100">
                <Switcher />
              </button>
            </div>
          )}
        </div>

        {/* chat history/main area */}
        <div className="flex-1 p-4 overflow-y-auto bg-white dark:bg-gray-700 ">
          <h2 className="font-bold text-center text-2xl ">
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
                  <div key={message._id} className="flex items-start space-x-2">
                    <img
                      src={`http://localhost:9000/${userData.senderImage}`}
                      alt={userData.sender}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-baseline justify-between">
                        <p className="font-semibold text-black dark:text-white">
                          {message.sender}
                        </p>
                        <span className="text-xs text-black dark:text-white">
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
              <p className="text-center">Keine Nachrichten gefunden</p>
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
              className=" text-black dark:text-white"
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
                <button className="mx-1 mt-1 z-50">
                  <EllipsisVerticalIcon className="text-black dark:text-white h-6" />
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
                <PaperAirplaneIcon className="h-6 mx-1 text-black dark:text-white" />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Maincontent;
