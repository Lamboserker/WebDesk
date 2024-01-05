import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { WorkspaceContext } from "../../../Context/WorkspaceContext";
import WorkspaceSettingsModal from "../../Modal/WorkspaceSettingsModal";

const WorkspaceDropdown = ({ position }) => {
  const style = {
    position: "absolute",
    top: `${position.y}px`,
    left: `${position.x}px`,
    zIndex: 100,
    height: "fit-content",
  };

  const { selectedWorkspace } = useContext(WorkspaceContext);
  const [workspaceDetails, setWorkspaceDetails] = useState(null);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchWorkspaceDetails = async () => {
      if (!selectedWorkspace) {
        setError("Keine Workspace ID ausgewählt");
        return; // Frühzeitige Rückkehr, wenn keine ID vorhanden ist.
      }

      try {
        const workspaceId = selectedWorkspace;
        const token = localStorage.getItem("userToken");

        const url = `http://localhost:9000/api/workspaces/${workspaceId}`;
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setWorkspaceDetails(response.data);
        setError(null); // Fehler zurücksetzen, falls zuvor einer aufgetreten ist.
      } catch (error) {
        console.error(
          "Fehler beim Abrufen des Workspace. Fehlerdetails:",
          error
        );
        setError("Fehler beim Abrufen des Workspace-Daten");
        // Setzen Sie hier vielleicht auch workspaceDetails zurück oder handhaben Sie den Fehler anders.
      }
    };

    fetchWorkspaceDetails();
  }, [selectedWorkspace]); // Stellen Sie sicher, dass dieser Hook nur ausgeführt wird, wenn sich selectedWorkspace ändert.

  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return "https://images.unsplash.com/photo-1702016049560-3d3f27b0071e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
    }
    const imageUrl = `http://localhost:9000/${imagePath}`;
    return imageUrl;
  };

  const handleSettingsClick = (e) => {
    e.stopPropagation(); // Verhindert, dass das Klick-Event zum document propagiert wird
    console.log("Settings clicked!");
    setIsModalOpen(true); // Öffnet das Modal
  };
  const closeModal = () => {
    setIsModalOpen(false); // Schließt das Modal
  };

  // Event-Handler für das Klicken ins Leere
  const handleClickOutside = (e) => {
    if (isModalOpen) {
      closeModal();
    }
  };

  useEffect(() => {
    // Listener für das Klicken ins Leere hinzufügen
    document.addEventListener("click", handleClickOutside);

    // Cleanup-Funktion, um den Listener zu entfernen
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isModalOpen]); // Abhängigkeit von isModalOpen, damit der Listener nur existiert, wenn das Modal geöffnet ist

  return (
    <div style={style}>
      <div className="flex items-center justify-center bg-white drop-shadow-md px-6">
        {" "}
        {/* Erhöhtes horizontales Padding */}
        <div className="w-full max-w-sm rounded-lg bg-white py-4 px-6 divide-gray-100">
          {" "}
          {/* Angepasstes Padding für inneren Container */}
          <div aria-label="header" className="flex space-x-4 items-center">
            <div
              aria-label="avatar"
              className="flex mr-auto items-center space-x-4"
            >
              {error && <p className="error">{error}</p>}
              {!error && workspaceDetails ? (
                <>
                  <img
                    src={getImageUrl(workspaceDetails.image)}
                    alt={`Avatar of ${workspaceDetails.name || "Workspace"}`}
                    className="w-16 h-16 shrink-0 rounded-full"
                  />
                  <div className="space-y-2 flex flex-col flex-1">
                    <div className="font-medium relative text-xl leading-tight text-gray-900">
                      <span className="flex">
                        <span className="whitespace-normal break-words max-w-xs">
                          {workspaceDetails.name || "Workspace Name"}
                          <span
                            aria-label="verified"
                            className="absolute top-1/2 -translate-y-1/2 right-0 inline-block rounded-full"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              aria-hidden="true"
                              className="w-6 h-6 ml-1 text-cyan-400"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              strokeWidth="2"
                              stroke="currentColor"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path
                                stroke="none"
                                d="M0 0h24v24H0z"
                                fill="none"
                              ></path>
                              <path
                                d="M12.01 2.011a3.2 3.2 0 0 1 2.113 .797l.154 .145l.698 .698a1.2 1.2 0 0 0 .71 .341l.135 .008h1a3.2 3.2 0 0 1 3.195 3.018l.005 .182v1c0 .27 .092 .533 .258 .743l.09 .1l.697 .698a3.2 3.2 0 0 1 .147 4.382l-.145 .154l-.698 .698a1.2 1.2 0 0 0 -.341 .71l-.008 .135v1a3.2 3.2 0 0 1 -3.018 3.195l-.182 .005h-1a1.2 1.2 0 0 0 -.743 .258l-.1 .09l-.698 .697a3.2 3.2 0 0 1 -4.382 .147l-.154 -.145l-.698 -.698a1.2 1.2 0 0 0 -.71 -.341l-.135 -.008h-1a3.2 3.2 0 0 1 -3.195 -3.018l-.005 -.182v-1a1.2 1.2 0 0 0 -.258 -.743l-.09 -.1l-.697 -.698a3.2 3.2 0 0 1 -.147 -4.382l.145 -.154l.698 -.698a1.2 1.2 0 0 0 .341 -.71l.008 -.135v-1l.005 -.182a3.2 3.2 0 0 1 3.013 -3.013l.182 -.005h1a1.2 1.2 0 0 0 .743 -.258l.1 -.09l.698 -.697a3.2 3.2 0 0 1 2.269 -.944zm3.697 7.282a1 1 0 0 0 -1.414 0l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.32 1.497l2 2l.094 .083a1 1 0 0 0 1.32 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z"
                                strokeWidth="0"
                                fill="currentColor"
                              ></path>
                            </svg>
                          </span>
                        </span>
                      </span>
                    </div>
                    <p className="font-normal text-base leading-tight text-gray-500 truncate">
                      evanyou@gmail.com
                    </p>
                  </div>
                </>
              ) : (
                <p>Lade Workspace-Daten...</p>
              )}
            </div>
          </div>
          <div aria-label="navigation" className="py-2">
            <nav className="grid gap-1">
              <a
                href="/"
                className="flex items-center leading-6 space-x-3 py-3 px-4 w-full text-lg text-gray-600 focus:outline-none hover:bg-gray-100 rounded-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  className="w-7 h-7"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"></path>
                  <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"></path>
                </svg>
                <span>User Settings</span>
              </a>
              <a
                href="/"
                className="flex items-center leading-6 space-x-3 py-3 px-4 w-full text-lg text-gray-600 focus:outline-none hover:bg-gray-100 rounded-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  className="w-7 h-7"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M9.785 6l8.215 8.215l-2.054 2.054a5.81 5.81 0 1 1 -8.215 -8.215l2.054 -2.054z"></path>
                  <path d="M4 20l3.5 -3.5"></path>
                  <path d="M15 4l-3.5 3.5"></path>
                  <path d="M20 9l-3.5 3.5"></path>
                </svg>
                <span>Integrations</span>
              </a>
              <button
                onClick={handleSettingsClick}
                className="flex items-center leading-6 space-x-3 py-3 px-4 w-full text-lg text-gray-600 focus:outline-none hover:bg-gray-100 rounded-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  className="w-7 h-7"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z"></path>
                  <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"></path>
                </svg>
                <span>Workspace Settings</span>
              </button>

              <WorkspaceSettingsModal isToggled={isModalOpen} />

              <a
                href="/"
                className="flex items-center leading-6 space-x-3 py-3 px-4 w-full text-lg text-gray-600 focus:outline-none hover:bg-gray-100 rounded-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  className="w-7 h-7"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
                  <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"></path>
                  <path d="M9 17h6"></path>
                  <path d="M9 13h6"></path>
                </svg>
                <span>Guide</span>
              </a>
              <a
                href="/"
                className="flex items-center leading-6 space-x-3 py-3 px-4 w-full text-lg text-gray-600 focus:outline-none hover:bg-gray-100 rounded-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  className="w-7 h-7"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M19.875 6.27c.7 .398 1.13 1.143 1.125 1.948v7.284c0 .809 -.443 1.555 -1.158 1.948l-6.75 4.27a2.269 2.269 0 0 1 -2.184 0l-6.75 -4.27a2.225 2.225 0 0 1 -1.158 -1.948v-7.285c0 -.809 .443 -1.554 1.158 -1.947l6.75 -3.98a2.33 2.33 0 0 1 2.25 0l6.75 3.98h-.033z"></path>
                  <path d="M12 16v.01"></path>
                  <path d="M12 13a2 2 0 0 0 .914 -3.782a1.98 1.98 0 0 0 -2.414 .483"></path>
                </svg>
                <span>Get Help</span>
              </a>
            </nav>
          </div>
          <div aria-label="account-upgrade" className="px-4 py-6">
            <div className="flex items-center space-x-3">
              <div className="mr-auto space-y-2">
                <p className="font-medium text-xl text-gray-900 leading-none">
                  Free Plan
                </p>
                <p className="font-normal text-lg text-gray-500 leading-none">
                  12,000 views
                </p>
              </div>
              <button
                type="button"
                className="inline-flex px-6 leading-6 py-3 rounded-md bg-indigo-50 hover:bg-indigo-50/80 transition-colors duration-200 text-indigo-500 font-medium text-lg"
              >
                Upgrade
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceDropdown;
