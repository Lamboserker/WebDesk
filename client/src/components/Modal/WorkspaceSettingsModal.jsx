import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faUpRightAndDownLeftFromCenter,
} from "@fortawesome/free-solid-svg-icons";

const WorkspaceSettingsModal = ({ isToggled, onClose }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const onExpand = () => {
    setIsExpanded(!isExpanded); // Toggle the expanded state
  };

  return (
    <AnimatePresence>
      {isToggled && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-10 flex items-center justify-center"
        >
          <motion.div
            className="relative bg-white p-6 rounded shadow-lg"
            // onClick={(e) => e.stopPropagation()}
            style={{
              width: isExpanded ? "80%" : "50%",
              height: isExpanded ? "80%" : "50%",
              maxWidth: "600px", // Maximale Breite des Modals
            }}
          >
            {/* Hier könnten Ihre Workspace-Informationen und Einstellungen stehen */}
            <div className="space-y-4">
              
              <h2 className="text-xl mt-5">Workspace Einstellungen</h2>
              {/* Weitere Felder und Funktionen zur Bearbeitung der Workspace-Details */}
            </div>

            <button
              onClick={onClose}
              className="absolute top-0 left-0 m-5"
              aria-label="Schließen"
            >
              <FontAwesomeIcon  icon={faXmark} className="rounded-full p-2" />
            </button>
            <button
              onClick={onExpand}
              className="absolute top-0 right-0 m-5"
              aria-label="Erweitern/Verkleinern"
            >
              <FontAwesomeIcon
                icon={faUpRightAndDownLeftFromCenter}
                className="rounded-full p-2"
              />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WorkspaceSettingsModal;
