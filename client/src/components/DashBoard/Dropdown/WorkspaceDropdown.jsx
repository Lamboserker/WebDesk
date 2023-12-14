import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useWorkspaceModal } from "../../../Context/WorkspaceModalContext";
import { motion, AnimatePresence } from "framer-motion";
import "../../styles/workspacedropdown.css";
import { HoverImageLinks } from "./HoverImageLinks";
Modal.setAppElement("#root");


function getBrightness(backgroundColor) {
  const rgb = backgroundColor.match(/\d+/g);
  if (!rgb) return 0;
  return (
    (parseInt(rgb[0], 10) * 299 +
      parseInt(rgb[1], 10) * 587 +
      parseInt(rgb[2], 10) * 114) /
    1000
  );
}

function setContrastColor(element) {
  if (!element) return;

  const backgroundColor = window
    .getComputedStyle(element)
    .getPropertyValue("background-color");
  const brightness = getBrightness(backgroundColor);

  element.style.color = brightness > 128 ? "black" : "white";
}

const WorkspaceDropdown = ({ onSelectWorkspace, onClose }) => {
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [error, setError] = useState("");
  const modalRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [currentIndex, setCurrentIndex] = useState(0);
  // const containerRef = useRef(null);
  // const dropdownRef = useRef(null);
  // const defaultImageUrl =
  //   "https://images.unsplash.com/photo-1702016049560-3d3f27b0071e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  // const baseUrl = "http://localhost:9000/";
  const navigate = useNavigate();
  const { openModal } = useWorkspaceModal();

  // useEffect(() => {
  //   const element = document.querySelector(".hidden-description");
  //   setContrastColor(element);
  // }, []);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const token = localStorage.getItem("userToken");
        const response = await axios.get(
          "http://localhost:9000/api/workspaces/list",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setWorkspaces(response.data);
        setSelectedWorkspace(response.data[0]?._id || null);
      } catch (error) {
        console.error("Error fetching workspaces", error);
        setError("Could not fetch workspaces.");
      }
    };

    fetchWorkspaces().then(() => {
      document
        .querySelectorAll(".hidden-description")
        .forEach(setContrastColor);
    });
  }, []);

  const handleClickOutside = useCallback(
    (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(false);
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  const openCreateWorkspaceModal = () => navigate("/workspace-modal");
  openModal();

  const handleSelectionChange = (workspace) => {
    setSelectedWorkspace(workspace._id);
    onSelectWorkspace(workspace);
    setIsModalOpen(false);
    onClose();
  };

  const getWorkspaceName = () => {
    const workspace = workspaces.find((w) => w._id === selectedWorkspace);
    return workspace ? workspace.name : "Select a Workspace";
  };

  // // Individual workspace item animation
  // const itemVariants = {
  //   initial: { opacity: 0, y: 20 },
  //   animate: (i) => ({
  //     opacity: 1,
  //     y: 0,
  //     transition: {
  //       delay: i * 0.1, // staggered animation
  //     },
  //   }),
  //   whileHover: { scale: 1.1 }, // hover effect
  // };

  const handleSelectWorkspace = (workspace) => {
    setSelectedWorkspace(workspace);
    onSelectWorkspace(workspace);
  };

  //  // Funktion, um zum nächsten Element zu scrollen
  //  const scrollToNextItem = (currentItemIndex) => {
  //   const nextItemIndex = (currentItemIndex + 1) % workspaces.length;
  //   const nextItemRef = itemRefs.current.get(workspaces[nextItemIndex].id);
  //   if (nextItemRef) {
  //     nextItemRef.scrollIntoView({ behavior: "smooth", block: "nearest" });
  //   }
  // };

  // // Scroll-Event-Handler
  // const handleScroll = (e) => {
  //   if (!canScroll) return;
  //   setCanScroll(false);
  //   setTimeout(() => setCanScroll(true), 500); // Verzögerung von 0,5 Sekunden

  //   const currentItemIndex = workspaces.findIndex(workspace => 
  //     itemRefs.current.get(workspace.id) === e.target
  //   );
  //   scrollToNextItem(currentItemIndex);
  // };

  return (
    <>
      {/* Error Message */}
      {error && <div className="error-message">{error}</div>}

      {/* Modal toggle */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="block text-4xl text-black dark:text-white focus:outline-none focus:ring-0 font-bold rounded-lg px-5 py-2.5 text-center"
        type="button"
      >
        {getWorkspaceName()}
      </button>

      {/* Main modal */}
      {isModalOpen && (
        <div
          id="select-modal"
          className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full h-[12rem] md:h-[17rem] lg:h-[22rem]"
        >
          <div
            ref={modalRef}
            className="relative p-4 w-full max-w-md max-h-full"
          >
            {/* Modal content */}
            <div className="relative bg-white rounded-lg shadow dark:bg-black">
              {/* Modal header */}
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="w-full text-lg font-semibold text-black dark:text-white">
                  Select a Workspace
                </h3>
                <button
                  onClick={openCreateWorkspaceModal}
                  className="ml-2 text-gray-400 hover:text-gray-600"
                  aria-label="Create new workspace"
                >
                  <svg
                    className="w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
              </div>
              {/* Modal body */}
              <div className="p-4 md:p-5">
                <ul className="space-y-4 mb-4 text-black dark:text-white">
                  <AnimatePresence>
                    {/* {workspaces.map((workspace, index) => {
                      const imageUrl = workspace.image
                        ? `${baseUrl}${workspace.image.replace(/\\/g, "/")}`
                        : defaultImageUrl;

                      return (
                        <motion.li
                          variants={itemVariants}
                          key={workspace._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ backgroundPosition: "left" }}
                          style={{
                            backgroundImage: `url(${imageUrl})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            overflow: "hidden",
                          }}
                          className="rounded-lg relative cursor-pointer workspace-item"
                          onClick={() => handleSelectionChange(workspace)}
                        >
                          <div className="p-5 text-gray-900 border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-500 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-900  dark:text-white">
                            <div className="w-full text-lg font-semibold">
                              {workspace.name}
                            </div>
                            <div className="w-full text-black dark:text-black hidden-description">
                              {workspace.description}
                            </div>
                          </div>
                        </motion.li>
                      );
                    })} */}
                    <HoverImageLinks
                      handleSelectionChange={handleSelectWorkspace}
                      workspaces={workspaces}
                    />
                  </AnimatePresence>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

WorkspaceDropdown.propTypes = {
  onSelectWorkspace: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default WorkspaceDropdown;
