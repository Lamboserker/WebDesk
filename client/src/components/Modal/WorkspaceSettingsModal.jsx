import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faUpRightAndDownLeftFromCenter,
  faDownLeftAndUpRightToCenter,
} from "@fortawesome/free-solid-svg-icons";
import { WorkspaceContext } from "../../Context/WorkspaceContext";
import { set } from "mongoose";
const WorkspaceSettingsModal = ({ isToggled, onClose, workspaceDetails }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [workspaceData, setWorkspaceData] = useState({
    name: "",
    description: "",
    image: "",
  });
  const [workspaceImage, setWorkspaceImage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { selectedWorkspace } = useContext(WorkspaceContext);

  // useEffect, um die aktuellen Workspace-Daten beim Laden der Komponente abzurufen
  useEffect(() => {
    async function fetchWorkspace() {
      const workspaceId = selectedWorkspace;
      const token = localStorage.getItem("userToken");
      try {
        const response = await axios.get(
          `http://localhost:9000/api/workspaces/${workspaceId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setWorkspaceData(response.data);
      } catch (error) {
        console.error("Fehler beim Abrufen des Workspaces", error);
      }
    }

    fetchWorkspace();
  }, [selectedWorkspace]);

  // Funktion, um Workspace-Details zu aktualisieren
  const updateWorkspaceDetails = async () => {
    try {
      const workspaceId = selectedWorkspace;
      const token = localStorage.getItem("userToken");
      const url = `http://localhost:9000/api/workspaces/${workspaceId}/update`;

      const requestData = {
        name: newName,
        description: newDescription,
        image: newImage,
      };

      const response = await axios.put(url, requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        setWorkspaceData(response.data.updatedWorkspace);

        alert("Workspace erfolgreich aktualisiert!");
      } else {
        alert("Fehler beim Aktualisieren des Workspace!");
      }
    } catch (error) {
      console.error("Fehler beim Aktualisieren des Workspace", error);

      alert("Fehler beim Aktualisieren des Workspace!");
    }
  };
  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return "https://picsum.photos/200"; // Standardbild
    }
    // Ersetzen Sie Backslashes durch Forward-Slashes und stellen Sie sicher, dass der Pfad korrekt ist
    const correctedPath = imagePath.replace(/\\/g, "/");
    return `http://localhost:9000/${correctedPath}`;
  };

  // Funktion, um einen Einladungslink zu generieren
  const generateInviteLink = () => {
    // Implementieren Sie die Logik, um einen Einladungslink zu generieren.
    // Dies könnte das Senden einer Anfrage an Ihren Server beinhalten,
    // um einen Link zu erstellen, der den Benutzer automatisch zum Workspace hinzufügt.
    const workspaceId = selectedWorkspace;
    return `http://localhost:9000/invite/${workspaceId}`;
  };

  const handleNameChange = (e) => {
    setNewName(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setNewDescription(e.target.value);
  };

  const handleImageChange = (e) => {
    setNewImage(e.target.files[0]);
  };

  const handleSaveChanges = () => {
    try {
      const formData = new FormData();
      if (newImage) {
        formData.append("image", newImage);
      }
      if (newName) {
        formData.append("name", newName);
      }
      if (newDescription) {
        formData.append("description", newDescription);
      }
      updateWorkspaceDetails(formData); // Implement this function to update workspace details in your backend
      setIsModalOpen(false);
    } catch (error) {
      console.error("Fehler beim Aktualisieren des Workspace", error);
      // Handhaben Sie hier Fehler, z.B. indem Sie eine Fehlermeldung anzeigen
    }
  };

  const handleGenerateInviteLink = () => {
    const link = generateInviteLink(); // Implement this function to generate a personal invite link
    navigator.clipboard.writeText(link); // Copy link to clipboard
  };

  return (
    <AnimatePresence>
      {isToggled && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-150 flex items-center justify-center" // z-index auf 150 gesetzt
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            className={`relative w-full ${
              isExpanded ? "max-w-none" : "max-w-4xl"
            } bg-white p-6 rounded-xl shadow-2xl overflow-auto`}
            style={{ height: isExpanded ? "90%" : "70%" }}
          >
            {/* Header with Workspace Image */}
            <div
              className="bg-cover bg-no-repeat bg-center rounded-t-xl p-4 text-white font-bold flex items-center justify-center"
              style={{
                backgroundImage: `url(${getImageUrl(workspaceDetails.image)})`,
                backgroundSize: "cover",
                backgroundPosition: "center top",
                height: isExpanded ? "300px" : "200px", // Höhere Bildhöhe, wenn expandiert
              }}
            >
              {console.log("Image is: ", workspaceDetails.image)}
              <div className="bg-black bg-opacity-60 w-full text-center py-2 rounded">
                {workspaceDetails?.name || "Workspace Name"}
              </div>
            </div>

            {/* Workspace Information */}
            <div className="mt-6 space-y-6">
              <div className="text-lg font-semibold text-gray-800">
                Description:
              </div>
              <p className="text-gray-600">
                {workspaceDetails?.description || "No description available."}
              </p>

              {/* Form for updating Workspace Details */}
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700">Workspace Name:</label>
                  <input
                    placeholder={workspaceData.name}
                    type="text"
                    value={newName}
                    onChange={handleNameChange}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-luckyPoint-600 focus:border-luckyPoint-300"
                  />
                </div>

                <div>
                  <label className="block text-gray-700">
                    Workspace Description:
                  </label>
                  <textarea
                    placeholder={workspaceData.description}
                    value={newDescription}
                    onChange={handleDescriptionChange}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-luckyPoint-600 focus:border-luckyPoint-300"
                  />
                </div>

                <div>
                  <label className="block text-gray-700">
                    Workspace Image:
                  </label>
                  <input
                    type="file"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-500 file:rounded file:border-0 file:px-4 file:py-2 file:bg-luckyPoint-100 file:text-luckyPoint-700 hover:file:bg-luckyPoint-200"
                  />
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={handleSaveChanges}
                  className="bg-luckyPoint-300 hover:bg-luckyPoint-400 text-luckyPoint-800 font-bold text-sm py-2 px-4 rounded"
                >
                  Save Changes
                </button>
                <button
                  onClick={handleGenerateInviteLink}
                  className="bg-luckyPoint-300 hover:bg-luckyPoint-400 text-luckyPoint-800 font-bold text-sm py-2 px-4 rounded"
                >
                  Generate Invite Link
                </button>
                <button
                  onClick={onClose}
                  className="bg-luckyPoint-300 hover:bg-luckyPoint-400 text-luckyPoint-800 font-bold text-sm py-2 px-4 rounded"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Close and Expand/Collapse Buttons */}
            <button
              onClick={onClose}
              className="absolute top-4 left-4 text-luckyPoint-600 hover:text-luckyPoint-700 transition-colors"
              aria-label="Close"
            >
              <FontAwesomeIcon
                icon={faXmark}
                className="rounded-full p-2 bg-white shadow-md"
              />
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)} // Umschalten des isExpanded-Zustands
              className="absolute top-4 right-4 text-luckyPoint-600 hover:text-luckyPoint-700 transition-colors"
              aria-label="Expand/Collapse"
            >
              <FontAwesomeIcon
                icon={
                  isExpanded
                    ? faDownLeftAndUpRightToCenter
                    : faUpRightAndDownLeftFromCenter
                } // Icon ändern basierend auf dem isExpanded-Zustand
                className="rounded-full p-2 bg-white shadow-md"
              />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WorkspaceSettingsModal;
