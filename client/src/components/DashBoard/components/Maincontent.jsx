import React, { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
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

const Maincontent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeChannel, setActiveChannel] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userData, setUserData] = useState({ sender: "", senderImage: "" });
  const [message, setMessage] = useState("");
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const dropdownRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const messageInputRef = useRef(null);
  const toggleDropdown = () => setShowDropdown(!showDropdown);
  const [showMenu] = useState(false);
  const onEmojiClick = (emojiObject) => {
    if (messageInputRef.current) {
      const quill = messageInputRef.current.getEditor();
      const range = quill.getSelection(true); // Get the current selection
      const position = range ? range.index : quill.getLength(); // Position to insert emoji
      quill.insertText(position, emojiObject.emoji); // Insert emoji at the position
      quill.setSelection(position + emojiObject.emoji.length); // Move cursor after the emoji
    }
  };

  const handleChannelClick = (channelId) => {
    setActiveChannel(channelId);
  };

  // Click outside the emoji picker handle to close it
  const handleClickOutsideEmoji = (event) => {
    if (
      emojiPickerRef.current &&
      !emojiPickerRef.current.contains(event.target)
    ) {
      setShowEmojiPicker(false);
    }
  };

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
      fetchMessages();
    }
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
  async function sendMessage() {
    console.log("userData:", userData.name);
    const channelId = activeChannel;
    const workspaceId = selectedWorkspace._id;
    const token = localStorage.getItem("userToken");
    const senderName = userData.name; // Assuming userData contains the current user's name
    const senderImage = userData.profileImage ? userData.profileImage : null; // Assuming userData contains the current user's image URL
    const Content = message;
    try {
      const response = await axios.post(
        `http://localhost:9000/api/messages/${workspaceId}/send`,
        {
          content: Content,
          channelId: channelId,
          senderName: senderName,
          senderImage: senderImage,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201) {
        setMessages((prevMessages) => [...prevMessages, response.data.message]);
      } else {
        console.error("Failed to send message:", response);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }

  const handleSendMessage = async (event) => {
    event.preventDefault();
    if (message) {
      await sendMessage(message);
      setMessage("");
    }
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
            </div>
          )}
        </div>

        {/* chat history/main area */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-700">
          <h2 className="font-bold mb-2">
            {activeChannel ? `#${activeChannel}` : "Please choose a channel"}
          </h2>
          <div className="space-y-4">
            {messages && messages.length > 0 ? (
              messages.map((message) => {
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
                    </div>
                  </div>
                );
              })
            ) : (
              <p>choose a channel</p>
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
                <button className="text-gray-500" onClick={sendMessage}>
                  <EllipsisVerticalIcon className="h-5 w-5" />
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
                className="ml-2 text-gray-700 rounded-lg p-2 z-50"
                style={{ fontSize: "24px" }}
              >
                <PaperAirplaneIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Maincontent;
