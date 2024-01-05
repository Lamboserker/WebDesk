import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faUpRightAndDownLeftFromCenter,
} from "@fortawesome/free-solid-svg-icons";

const Modal = ({ isToggled, children, onClose }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const onExpand = () => {
    setIsExpanded(!isExpanded); // Toggle the expanded state
  };
  return (
    <AnimatePresence>
      {isToggled && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: isExpanded ? 1 : 0.5 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-10" // Tailwind für .modal-overlay
        >
          <motion.div
            className="relative bg-white p-6 rounded shadow m-auto" // Tailwind für .modal-content
            style={{
              width: isExpanded ? "100%" : "auto",
              height: isExpanded ? "100%" : "auto",
            }}
          >
            {children}
            <button
              onClick={onClose}
              className="absolute top-0 left-0 m-5 text-center "
            >
              <FontAwesomeIcon
                icon={faXmark}
                className="rounded-full p-2 text-gray-600 text-4xl transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-110 duration-300 transform hover:text-red-500 "
              />
            </button>
            <button
              onClick={onExpand}
              className="absolute top-0 right-0 m-5 text center"
            >
              <FontAwesomeIcon
                icon={faUpRightAndDownLeftFromCenter}
                className="rounded-full p-2 text-gray-600 text-4xl transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-110 duration-300 transform hover:text-green-500"
              />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
