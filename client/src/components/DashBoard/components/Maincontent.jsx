import React, { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import {
  PaperAirplaneIcon,
  EllipsisVerticalIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import Picker from "emoji-picker-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { modules, formats } from "../index";
import Switcher from "../../../Switcher";
import "../../styles/dashboard.css";
import Whiteboard from "./FigJam/Whiteboard";

const Maincontent = ({ activeChannel }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userData, setUserData] = useState({ sender: "", senderImage: "" });
  const [message, setMessage] = useState("");
  const quillRef = useRef(null);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [displayWhiteboard, setDisplayWhiteboard] = useState(false);
  const [channelInfo, setChannelInfo] = useState(null);
  const dropdownRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const messageInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const socket = io("http://localhost:9000"); // URL Ihres Socket.IO-Servers
  const navigate = useNavigate();
  const toggleDropdown = () => setShowDropdown(!showDropdown);
  const toggleMenu = () => setShowMenu(!showMenu);

  useEffect(() => {
    if (activeChannel) {
      fetchChannelInfo(activeChannel).then((info) => setChannelInfo(info));
    }
  }, [activeChannel]);

  // Function to check if a new day has started and return a formatted date

  const isNewDay = (currentMessage, previousMessage) => {
    if (!previousMessage) return true; // Wenn es die erste Nachricht ist, neuer Tag

    const currentDate = new Date(currentMessage.createdAt);
    const previousDate = new Date(previousMessage.createdAt);

    return (
      currentDate.getDate() !== previousDate.getDate() ||
      currentDate.getMonth() !== previousDate.getMonth() ||
      currentDate.getFullYear() !== previousDate.getFullYear()
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}.${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}.${date.getFullYear()}`;
  };

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

  useEffect(() => {
    if (quillRef.current) {
      const quillInstance = quillRef.current.getEditor();
      const quillRoot = quillInstance.root;

      const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault(); // Verhindern, dass ein neuer Zeilenumbruch eingefügt wird
          sendMessage();
        }
      };

      quillRoot.addEventListener("keydown", handleKeyPress);

      return () => {
        quillRoot.removeEventListener("keydown", handleKeyPress);
      };
    }
  }, [quillRef]);

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

  const handleDropdownSelection = (selection) => {
    setShowDropdown(false); // Dropdown schließen
    if (selection === "switch to whiteboard") {
      setDisplayWhiteboard(true); // Zeigt das Whiteboard an
    } else {
      // Andere Dropdown-Optionen handhaben
    }
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

  const displayedMessages = searchTerm ? filteredMessages : messages;

  const navigateTo = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    // Remove the token from LocalStorage
    localStorage.removeItem("userToken");
    localStorage.setItem("bannerVisible", "true");
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

  const fetchChannelInfo = async (channelId) => {
    const token = localStorage.getItem("userToken");
    try {
      const response = await axios.get(
        `http://localhost:9000/api/channels/${channelId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data; // Angenommen, dies gibt die Channel-Informationen zurück
    } catch (error) {
      console.error("Error fetching channel info:", error);
      return null;
    }
  };

  return (
    <>
      {/* Main Content */}
      <div className="flex flex-col flex-1 h-full overflow-y-scroll">
        {/* Searchbar */}
        <div className="relative p-4 items-center">
          {/* Input field */}
          <div className="w-full ">
            <div className="relative w-full min-w-[200px] h-10">
              <input
                className="peer w-full h-full dark:bg-luckyPoint-700 text-black dark:text-luckyPoint-200 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-luckyPoint-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-transparent placeholder-shown:border-t-transparent border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-transparent focus:border-luckyPoint-200 shadow-xl"
                placeholder=""
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <label className="flex w-full h-full select-none pointer-events-none absolute left-0 font-bold !overflow-visible truncate peer-placeholder-shown:text-black dark:peer-placeholder-shown:text-luckyPoint-200 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-black transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-black dark:text-luckyPoint-200 peer-focus:text-black dark:peer-focus:text-luckyPoint-200 before:border-luckyPoint-200 peer-focus:before:!border-luckyPoint-100 after:border-luckyPoint-100 peer-focus:after:!border-luckyPoint-100">
                search message
              </label>
            </div>
          </div>

          {/* Hamburger menu icon enlarged and moved inside the input field */}
          <div className="absolute right-4 inset-y-0 flex items-center bg-transparent ">
            <Bars3Icon
              className="bg-luckyPoint-400 dark:bg-luckyPoint-600 w-6 h-6 mr-2 text-black dark:text-luckyPoint-200 rounded-md border border-transparent hover:border-luckyPoint-200 dark:hover:border-luckyPoint-200 hover:bg-luckyPoint-100 dark:hover:bg-luckyPoint-700 transition-all cursor-pointer"
              onClick={toggleDropdown}
            />
          </div>

          {/* Dropdown menu */}
          {showDropdown && (
            <div
              ref={dropdownRef}
              className="absolute right-0 mt-2 w-56 bg-luckyPoint-200 dark:bg-luckyPoint-600 rounded-md shadow-md z-50"
            >
              {/* Grid-Layout Inhalte */}
              <div className="grid grid-cols-2 grid-rows-4 gap-4 items-center  px-4 py-2 mt-2">
                <div className="col-span-2  px-4 py-2 mt-2">
                  <span className="text-black font-bold uppercase ">
                    Get help
                  </span>
                </div>
                <div className="col-span-2 row-start-2  px-4 py-2 mt-2 text-black font-bold uppercase ">
                  FAQ
                </div>
                <div className="col-span-2 row-start-3  px-4 py-2 mt-2 text-black font-bold uppercase ">
                  News
                </div>
                <div className="row-start-4  px-4 py-2 mt-2">
                  <button
                    className=" text-black font-bold uppercase "
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
                <div className="row-start-4  px-4 py-2 mt-2">
                  <Switcher />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* chat history/main area */}

        {displayWhiteboard ? (
          <Whiteboard parentRef={messagesContainerRef} />
        ) : (
          // Whiteboard anzeigen
          <div
            ref={messagesContainerRef}
            className="flex-1 p-4 overflow-y-auto bg-luckyPoint-200 dark:bg-luckyPoint-800 border border-t-2 border-luckyPoint-200 dark:border-luckyPoint-700"
          >
            <div className="flex flex-col flex-1 h-full overflow-y-scroll">
              <h2 className="font-bold text-center text-2xl">
                {channelInfo
                  ? `#${channelInfo.name}`
                  : "Please choose a channel"}
              </h2>
            </div>
            <div className="space-y-4 text-black dark:text-luckyPoint-200">
              {displayedMessages && displayedMessages.length > 0 ? (
                displayedMessages.map((message, index) => {
                  const showDateHeader = isNewDay(
                    message,
                    displayedMessages[index - 1]
                  );
                  const fallbackImage =
                    "https://img.freepik.com/premium-vector/social-media-user-profile-icon-video-call-screen_97886-10046.jpg";

                  return (
                    <React.Fragment key={message._id}>
                      {showDateHeader && (
                        <div className="flex items-center my-2">
                          <hr className="flex-grow border-t border-luckyPoint-700 dark:border-luckyPoint-400" />
                          <span className="px-4 py-1 mx-2 text-sm text-black dark:text-luckyPoint-200 bg-luckyPoint-100 dark:bg-luckyPoint-600 rounded-full">
                            {formatDate(message.createdAt)}
                          </span>
                          <hr className="flex-grow border-t border-luckyPoint-700 dark:border-luckyPoint-400" />
                        </div>
                      )}
                      <div className="flex items-start space-x-2">
                        <img
                          src={
                            message.senderImage
                              ? `http://localhost:9000/${message.senderImage}`
                              : fallbackImage
                          }
                          onError={(e) => (e.target.src = fallbackImage)}
                          alt={message.sender}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-baseline justify-between">
                            <p className="font-semibold text-black dark:text-luckyPoint-200">
                              {message.sender}
                              <span className="text-xs text-luckyPoint-500 dark:text-gray-luckyPoint m-3">
                                {new Date(message.createdAt).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false,
                                  }
                                )}
                              </span>
                            </p>
                          </div>
                          <Message htmlContent={message.content} />
                          <div ref={messagesEndRef} />
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })
              ) : (
                <p className="text-center">No messages found</p>
              )}
            </div>
          </div>
        )}
        {/* message input area */}
        {activeChannel && (
          <div className="p-4 bg-transparent shadow-md flex flex-col custom-quill ">
            <ReactQuill
              placeholder="Type a message..."
              onChange={(value) => setMessage(value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  handleSendMessage(event);
                }
              }}
              ref={messageInputRef}
              value={message}
              modules={modules}
              formats={formats}
              className="text-black dark:text-luckyPoint-200 placeholder:text-luckyPoint-200 dark:placeholder:text-white"
            />

            {/* Message Input with Emoji Picker */}
            <div className="flex items-center p-2 rounded-b-lg justify-end">
              <button
                className="text-gray-500 mx-1 z-10"
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
              <div className="flex items-center justify-center">
                <button className="mx-1 mt-1 z-20" onClick={toggleMenu}>
                  <EllipsisVerticalIcon className="text-black dark:text-luckyPoint-200 h-6 " />
                </button>
                {showMenu && (
                  <div
                    ref={dropdownRef}
                    className="absolute right-10 mt-10 w-56 bg-luckyPoint-200 dark:bg-luckyPoint-600 rounded-md shadow-md z-50"
                  >
                    <div
                      className="text-black font-bold uppercase px-4 py-2 cursor-pointer hover:bg-luckyPoint-300"
                      onClick={() =>
                        handleDropdownSelection("switch to whiteboard")
                      }
                    >
                      Change to Whiteboard
                    </div>
                    {/* Weitere Dropdown-Optionen hier hinzufügen */}
                  </div>
                )}
              </div>
              <button
                onClick={handleSendMessage}
                className="ml-2 text-luckyPoint-700 rounded-lg  z-20"
              >
                <PaperAirplaneIcon className="h-6 mx-1 text-black dark:text-luckyPoint-200" />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Maincontent;
