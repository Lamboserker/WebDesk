import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import "tailwindcss/tailwind.css";

const WorkspaceModal = ({ onClose }) => {
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceDescription, setWorkspaceDescription] = useState("");
  const navigate = useNavigate();
  // Funktion zum Erstellen eines neuen Workspaces
  const createWorkspace = async () => {
    try {
      // Extrahieren des Tokens
      const token = localStorage.getItem("userToken");

      const response = await axios.post(
        "http://localhost:9000/api/workspaces/create",
        {
          name: workspaceName,
          description: workspaceDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Workspace erstellt:", response.data);
      onClose();
      navigate("/dashboard");
    } catch (error) {
      console.error("Fehler beim Erstellen des Workspaces:", error);
    }
  };

  

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
      >
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Create a New Workspace</h2>
          <input
            type="text"
            placeholder="Workspace Name"
            className="border p-2 w-full mb-4"
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
          />
          <textarea
            placeholder="Workspace Description"
            className="border p-2 w-full mb-4"
            value={workspaceDescription}
            onChange={(e) => setWorkspaceDescription(e.target.value)}
          />
          <button
            onClick={createWorkspace}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Create Workspace
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WorkspaceModal;
