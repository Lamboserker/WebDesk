import React, { useState, useRef, useEffect } from "react";
import "../styles/dashboard.css";
import {
  PlusIcon,
  PaperAirplaneIcon,
  EllipsisVerticalIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import Picker from "emoji-picker-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // import styles

import { modules, formats } from "./index";

const Dashboard = () => {
  const [activeChannel, setActiveChannel] = useState(null);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const emojiPickerRef = useRef(null);
  const [showMenu, setShowMenu] = useState(false);
  const messageInputRef = useRef(null);

  const channels = ["channel-1", "channel-2"]; // paste here more channels
  const messages = {
    "channel-1": ["message 1", "message 2"], // Dummy-message for channel-1
    "channel-2": ["message 3", "message 4"], // Dummy-message for channel-2
  };

  const handleCreateChannel = () => {
    console.log("Create new channel");
  };

  const handleChannelClick = (channel) => {
    setActiveChannel(channel);
  };

  const handleMessageSend = () => {
    const messageContent = messageInputRef.current.innerHTML;
    console.log("message sent:", messageContent);
    // Add logic to send the message (now with HTML formatting)
    messageInputRef.current.innerHTML = ""; // Clear the field after sending
  };

  const onEmojiClick = (emojiObject) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
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

  // Add event listener for clicks outside
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex h-screen">
      {/* sidebar */}
      <div className="flex flex-col bg-gray-800 text-white w-64">
        {/* Top Bar/Header */}
        <div className="flex items-center justify-between h-16 px-4 shadow-md">
          <h1 className="text-lg font-bold">WebDesk</h1>
          <div className="space-x-2">
            <button>🔍</button> {/* Search Icon */}
            <button>☰</button> {/* Menu Icon */}
          </div>
        </div>

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
          {/* List of channels */}
          {channels.map((channel) => (
            <button
              key={channel}
              className="flex items-center py-2 text-sm font-medium hover:bg-gray-700"
              onClick={() => handleChannelClick(channel)}
            >
              # {channel}
            </button>
          ))}
        </div>

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
      <div className="flex flex-col flex-1 bg-blue-950">
        {/* Searchbar */}
        <div className="bg-gray-800 p-4 flex items-center">
          <MagnifyingGlassIcon className="h-5 w-5 text-white mr-2" />
          <input
            type="text"
            className="flex-1 p-2 rounded"
            placeholder="Nachrichten suchen"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {/* chat history */}
        <div className="flex-1 p-4 overflow-y-auto">
          <h2 className="font-bold mb-2">
            {activeChannel ? `#${activeChannel}` : "Wählen Sie einen Kanal"}
          </h2>
          <div className="space-y-4">
            {activeChannel &&
              messages[activeChannel].map((msg, index) => (
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
          <div className="p-4 bg-blue-950 shadow-md flex flex-col">
            <ReactQuill
              className="custom-quill flex-1 mr-2"
              theme="snow"
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
                <div ref={emojiPickerRef} className="absolute bottom-12 left-0">
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
