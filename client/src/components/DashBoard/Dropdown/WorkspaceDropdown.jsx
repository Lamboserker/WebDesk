import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";

Modal.setAppElement("#root"); // Für Accessibility-Zwecke

const WorkspaceDropdown = ({ onSelectWorkspace }) => {
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState("");
  const modalRef = useRef(null); // Referenz für das Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleWorkspaceClick = (workspace) => {
    setSelectedWorkspace(workspace._id);
    onSelectWorkspace(workspace);
  };

  useEffect(() => {
    // Event Listener, um Klicks außerhalb des Modals zu erkennen
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(false);
      }
    };

    // Event Listener hinzufügen
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup-Funktion
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const openCreateWorkspaceModal = () => {
    navigate("/workspace-modal");
  };

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
        setSelectedWorkspace(response.data[0]._id);
      } catch (error) {
        console.error("Fehler beim Abrufen der Workspaces", error);
      }
    };
    fetchWorkspaces();
  }, []);

  const handleSelectionChange = (workspace) => {
    setSelectedWorkspace(workspace._id);
    onSelectWorkspace(workspace);
    setIsModalOpen(false);
  };

  const getWorkspaceName = () => {
    const workspace = workspaces.find((w) => w._id === selectedWorkspace);
    return workspace ? workspace.name : "Select a Workspace";
  };

  return (
    <>
      {/* Modal toggle */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="block text-2xl text-white focus:outline-none focus:ring-0 font-medium rounded-lg  px-5 py-2.5 text-center"
        type="button"
      >
        {getWorkspaceName()}
      </button>

      {/* Main modal */}
      {isModalOpen && (
        <div
          id="select-modal"
          className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
          <div
            ref={modalRef}
            className="relative p-4 w-full max-w-md max-h-full"
          >
            {/* Modal content */}
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              {/* Modal header */}
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className=" w-full text-lg font-semibold text-gray-900 dark:text-white">
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
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  {/* Close icon */}
                </button>
              </div>
              {/* Modal body */}
              <div className="p-4 md:p-5">
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Select your workspace:
                </p>
                <ul className="space-y-4 mb-4">
                  {workspaces.map((workspace) => (
                    <li key={workspace._id}>
                      <input
                        type="radio"
                        id={`workspace-${workspace._id}`}
                        name="workspace"
                        value={workspace._id}
                        className="hidden peer"
                        checked={selectedWorkspace === workspace._id}
                        onChange={() => handleSelectionChange(workspace)}
                      />
                      <label
                        htmlFor={`workspace-${workspace._id}`}
                        className="inline-flex items-center justify-between w-full p-5 text-gray-900 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-500 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-900 hover:bg-gray-100 dark:text-white dark:bg-gray-600 dark:hover:bg-gray-500"
                      >
                        <div className="block">
                          <div className="w-full text-lg font-semibold">
                            {workspace.name}
                          </div>
                          <div className="w-full text-gray-500 dark:text-gray-400">
                            Description or details here
                          </div>
                        </div>
                        <svg
                          className="w-4 h-4 ms-3 rtl:rotate-180 text-gray-500 dark:text-gray-400"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 14 10"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M1 5h12m0 0L9 1m4 4L9 9"
                          />
                        </svg>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WorkspaceDropdown;
