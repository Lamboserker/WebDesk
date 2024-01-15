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
import StyledInput from "../StyledInput/StyledInput";
const WorkspaceSettingsModal = ({
  isToggled,
  onClose,
  workspaceDetails = {},
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [repoURL, setRepoURL] = useState("");
  const [workspaceData, setWorkspaceData] = useState(
    workspaceDetails || {
      name: "",
      description: "",
      image: "",
    }
  );
  const { selectedWorkspace } = useContext(WorkspaceContext);
  const [alertState, setAlertState] = useState({
    show: false,
    message: "",
    type: "",
  });
  const displayData = isLoading ? workspaceDetails : workspaceData;

  const getAlertStyle = (type) => {
    let backgroundColor;
    switch (type) {
      case "success":
        backgroundColor = "#4CAF50"; // Grün
        break;
      case "error":
        backgroundColor = "#f44336"; // Rot
        break;
      case "warning":
        backgroundColor = "#ff9800"; // Orange
        break;
      default:
        backgroundColor = "#2196F3"; // Blau
    }
    return {
      position: "fixed",
      top: "20px",
      left: "50%",
      transform: "translateX(-50%)",
      backgroundColor,
      color: "white",
      padding: "10px",
      borderRadius: "5px",
      boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.3)",
      zIndex: 1000,
    };
  };

  // useEffect, um die aktuellen Workspace-Daten beim Laden der Komponente abzurufen
  useEffect(() => {
    const fetchWorkspace = async () => {
      setIsLoading(true); //Beginn des Ladens
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
        setIsLoading(false); // Ende des Ladens falls ein Fehler auftritt
      } catch (error) {
        console.error("Fehler beim Abrufen des Workspaces", error);
      }
    };

    fetchWorkspace();
  }, [selectedWorkspace]);

  // Funktion, um Workspace-Details zu aktualisieren
  const updateWorkspaceDetails = async () => {
    setIsLoading(true);
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
        // Aktualisieren Sie workspaceData mit der Antwort vom Backend
        setWorkspaceData(response.data.updatedWorkspace);
        showAlert("Workspace erfolgreich aktualisiert!", "success");
      } else {
        showAlert("Fehler beim Aktualisieren des Workspace!", "error");
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Fehler beim Aktualisieren des Workspace", error);
      showAlert("Fehler beim Aktualisieren des Workspace!", "error");
      setIsLoading(false);
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
    } catch (error) {
      console.error("Fehler beim Aktualisieren des Workspace", error);
      // Handhaben Sie hier Fehler, z.B. indem Sie eine Fehlermeldung anzeigen
    }
  };

  const handleGenerateInviteLink = () => {
    const link = generateInviteLink();
    navigator.clipboard
      .writeText(link)
      .then(() => {
        showAlert(`Einladungslink kopiert: ${link}`, "success");
      })
      .catch((err) => {
        console.error("Fehler beim Kopieren des Links: ", err);
        showAlert("Fehler beim Kopieren des Einladungslinks!", "error");
      });
  };

  const showAlert = (message) => {
    setAlertState({ show: true, message });
    setTimeout(() => setAlertState({ show: false, message: "" }), 3000);
  };

  const addRepoToWorkspace = async () => {
    try {
      const response = await axios.post(
        "http://localhost:9000/api/workspaces/add-github-repo",
        { repoURL },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      // Verarbeite die Antwort, speichere Informationen oder aktualisiere den Zustand
      console.log(response.data);
    } catch (error) {
      console.error("Fehler beim Hinzufügen des GitHub-Repos", error);
    }
  };

  return (
    <AnimatePresence>
      {isLoading ? (
        <div>Laden...</div>
      ) : isToggled ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-150 flex items-center justify-center"
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
                backgroundImage: `url(${getImageUrl(displayData?.image)})`,
                backgroundSize: "cover",
                backgroundPosition: "center top",
                height: isExpanded ? "300px" : "200px",
              }}
            >
              <div className="bg-black bg-opacity-60 w-full text-center py-2 rounded">
                {displayData?.name || "Workspace Name"}
              </div>
            </div>

            {/* Workspace Information */}
            <div className="mt-6 space-y-6">
              <div className="text-lg font-semibold text-gray-800">
                Description:
              </div>
              <p className="text-gray-600">
                {displayData?.description || "No description available."}
              </p>

              {/* Form for updating Workspace Details */}
              <div className="space-y-4">
                <div>
                  <StyledInput
                    label={"Workspace Name"}
                    placeholder={displayData?.name}
                    type="text"
                    value={newName}
                    onChange={handleNameChange}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-luckyPoint-600 focus:border-luckyPoint-300"
                  />
                </div>

                <div className="relative w-full min-w-[200px]">
                  <textarea
                    id="message"
                    className="peer w-full h-full  text-black  font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-luckyPoint-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-transparent placeholder-shown:border-t-transparent border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-transparent focus:border-luckyPoint-200 shadow-xl"
                    rows="4"
                    placeholder=""
                    value={newDescription}
                    onChange={handleDescriptionChange}
                  ></textarea>
                  <label className="flex w-full h-full select-none pointer-events-none absolute left-0 font-bold !overflow-visible truncate peer-placeholder-shown:text-black dark:peer-placeholder-shown:text-black leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-black transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-black dark:text-black peer-focus:text-black dark:peer-focus:text-black before:border-luckyPoint-200 peer-focus:before:!border-luckyPoint-100 after:border-luckyPoint-100 peer-focus:after:!border-luckyPoint-100">
                    Write your bio here...
                  </label>
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="GitHub Repo URL"
                    value={repoURL}
                    onChange={(e) => setRepoURL(e.target.value)}
                  />
                  <button onClick={addRepoToWorkspace}>
                    Add Repo to Workspace
                  </button>
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
                  className="bg-luckyPoint-900 hover:bg-luckyPoint-700 text-white font-bold py-2 px-4 rounded flex items-center space-x-2 mt-5"
                >
                  Save Changes
                </button>
                <button
                  onClick={handleGenerateInviteLink}
                  className="bg-luckyPoint-700 hover:bg-luckyPoint-700 text-white font-bold py-2 px-4 rounded flex items-center space-x-2 mt-5"
                >
                  Generate Invite Link
                </button>
                <button
                  onClick={onClose}
                  className="bg-luckyPoint-400 hover:bg-luckyPoint-700 text-white font-bold py-2 px-4 rounded flex items-center space-x-2 mt-5"
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
                className="rounded-full p-2 text-gray-600 text-4xl transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-110 duration-300 transform hover:text-red-500"
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
                className="rounded-full p-2 text-gray-600 text-4xl transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-110 duration-300 transform hover:text-green-500"
              />
            </button>
          </motion.div>
        </motion.div>
      ) : null}

      {alertState.show && (
        <div style={getAlertStyle(alertState.type)}>{alertState.message}</div>
      )}
    </AnimatePresence>
  );
};

export default WorkspaceSettingsModal;
