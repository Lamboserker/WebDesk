import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { PhotoIcon } from "@heroicons/react/24/outline";
import ReactCrop from "react-image-crop";
import "tailwindcss/tailwind.css";
import "react-image-crop/dist/ReactCrop.css";
import { useWorkspaceModal } from "../../Context/WorkspaceModalContext";
export const getCroppedImg = (imageSrc, crop, fileName) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext("2d");

      // Draw the image on the canvas based on the crop parameters
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );

      // Convert canvas to blob and resolve the promise
      canvas.toBlob((blob) => {
        if (!blob) {
          // Reject the promise if blob creation fails
          reject(new Error("Canvas is empty"));
          return;
        }
        blob.name = fileName;
        resolve(blob);
      }, "image/jpeg");
    };
    image.src = imageSrc;
  });
};

const WorkspaceModal = ({ onClose }) => {
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceDescription, setWorkspaceDescription] = useState("");
  const [crop, setCrop] = useState({
    unit: "%",
    width: 80,
    height: 80,
    x: 0,
    y: 0,
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [imageRef, setImageRef] = useState(null);
  const [workspaceImage, setWorkspaceImage] = useState(null);
  const [workspaceImagePreview, setWorkspaceImagePreview] = useState(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [croppedFile, setCroppedFile] = useState(null);
  const [croppedPreview, setCroppedPreview] = useState(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState(null);
  const navigate = useNavigate();
  const { closeModal } = useWorkspaceModal();

  const handleDropzoneFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setWorkspaceImage(file);
      const filePreviewUrl = URL.createObjectURL(file);
      setWorkspaceImagePreview(filePreviewUrl);
      setCropModalOpen(true);
    }
  };

  const handleImageCrop = (newCrop) => {
    setCrop(newCrop);
  };

  const makeClientCrop = async (crop) => {
    if (workspaceImagePreview && crop.width && crop.height) {
      try {
        const croppedBlob = await getCroppedImg(
          workspaceImagePreview,
          crop,
          "newFile.jpeg" // Setzen Sie hier einen sinnvollen Dateinamen mit Dateiendung
        );
        const croppedImageUrl = URL.createObjectURL(croppedBlob);
        setCroppedImageUrl(croppedImageUrl);
        setCroppedPreview(croppedImageUrl);
        setCroppedFile(
          new File([croppedBlob], "newFile.jpeg", { type: "image/jpeg" })
        ); // Erstellen eines File-Objekts aus dem Blob
      } catch (error) {
        console.error("Fehler beim Zuschneiden des Bildes:", error);
      }
    }
  };

  const onImageLoaded = (image) => {
    setImageRef(image);
  };

  // Funktion zum Erstellen eines neuen Workspaces
  const createWorkspace = async () => {
    const formData = new FormData();
    formData.append("workspaceImages", croppedFile); // Append the image file
    formData.append("name", workspaceName); // Append other fields
    formData.append("description", workspaceDescription);

    const token = localStorage.getItem("userToken");
    try {
      console.log("workspaceImage:", croppedFile);
      const response = await axios.post(
        "http://localhost:9000/api/workspaces/create",
        formData, // Pass the entire formData object
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // Don't set 'Content-Type': 'multipart/form-data', Axios will set it automatically
          },
        }
      );

      console.log("Workspace erstellt:", response.data);
      closeModal();
      navigate("/dashboard");
    } catch (error) {
      console.error("Fehler beim Erstellen des Workspaces:", error);
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
      // Hier könnten weitere Styling- und Animationsattribute ergänzt werden...
      >
        <div className="p-5">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-semibold">Create Workspace</h2>
            <PhotoIcon className="h-6 w-6 text-gray-500" /> {/* Heroicon */}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Workspace Name
            </label>
            <input
              type="text"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={workspaceDescription}
              onChange={(e) => setWorkspaceDescription(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Workspace Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleDropzoneFileChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />

            {workspaceImagePreview && (
              <img
                src={workspaceImagePreview}
                alt="Workspace Preview"
                className="mt-4 w-40 h-auto rounded-md"
              />
            )}
          </div>
          <button
            onClick={createWorkspace}
            className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Workspace
          </button>
        </div>
        {cropModalOpen && (
          <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-5 rounded-lg">
              {workspaceImagePreview && (
                <ReactCrop
                  src={workspaceImage}
                  crop={crop}
                  onImageLoaded={onImageLoaded}
                  onChange={handleImageCrop}
                  onComplete={makeClientCrop}
                >
                  <img src={workspaceImagePreview} alt="Crop" />
                  <button onClick={() => makeClientCrop(crop)}>Adjust</button>
                </ReactCrop>
              )}
              {croppedPreview && (
                <div className="flex justify-center mt-4">
                  <img
                    src={croppedPreview}
                    alt="Vorschau des zugeschnittenen Bildes"
                    style={{
                      maxWidth: "300px",
                      maxHeight: "300px",
                      objectFit: "contain",
                    }}
                  />
                </div>
              )}

              <button onClick={() => setCropModalOpen(false)} className="mb-8">
                Close
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default WorkspaceModal;
