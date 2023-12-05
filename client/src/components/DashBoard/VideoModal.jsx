import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';
import {XMarkIcon} from '@heroicons/react/24/outline';
import '../styles/modalstyles.css';

 const Modal = ({ isToggled, children, onClose }) => {
  return (
    <AnimatePresence>
      {isToggled && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed top-0 left-0 w-6/12 h-6/12 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <motion.div
            className="modal-content bg-white p-6 rounded shadow"
            onClick={(e) => e.stopPropagation()}
          >
             <button onClick={onClose} className="close-modal-button">
          <XMarkIcon className="h-6 w-6 bg-white z-50" /> {/* Close-Icon */}
        </button>
        {children}
            {children}
            <button onClick={onClose}>Schließen</button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};


export default Modal;