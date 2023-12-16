import { useState, useEffect } from "react";
import axios from "axios";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import "../../styles/profile.css";
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

      canvas.toBlob((blob) => {
        if (!blob) {
          console.error("Canvas is empty");
          reject(new Error("Canvas is empty"));
          return;
        }
        blob.name = fileName;
        resolve(blob);
      }, "image/jpeg");
    };

    image.onerror = () => {
      reject(new Error("Image load error"));
    };

    image.src = imageSrc;
  });
};

const ProfileForm = () => {
  const [userData, setUserData] = useState({});
  const [profileImage, setProfileImage] = useState("");
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [crop, setCrop] = useState({
    unit: "%",
    width: 80,
    height: 80,
    x: 0,
    y: 0,
  });
  const [, setCroppedImageUrl] = useState(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    profession: "",
    bio: "",
  });
  const [croppedFile, setCroppedFile] = useState(null);
  const [croppedPreview, setCroppedPreview] = useState(null);

  async function validateToken() {
    try {
      const response = await axios.get(
        "http://localhost:9000/api/users/validate-token",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      if (response.data.valid) {
        return response.data.userId;
      } else {
        throw new Error("Invalid token");
      }
    } catch (error) {
      console.error("Token validation error:", error);
      return null;
    }
  }

  // fetch current user information
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("userToken");
        const userId = await validateToken();
        const response = await axios.get("http://localhost:9000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
          params: { userId: userId },
        });
        setUserData({
          name: response.data.name,
          profileImage: response.data.profileImage,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleDropzoneFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const filePreviewUrl = URL.createObjectURL(file);
      setProfileImagePreview(filePreviewUrl);
      setCropModalOpen(true);
    }
  };

  const handleImageCrop = (newCrop) => {
    setCrop(newCrop);
  };

  console.log("preview for: ", profileImagePreview);

  const makeClientCrop = async (crop) => {
    if (profileImagePreview && crop.width && crop.height) {
      try {
        const croppedBlob = await getCroppedImg(
          profileImagePreview,
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
    // Hier können Sie Aktionen durchführen, wenn das Bild geladen wird
    // Wenn keine Aktionen erforderlich sind, kann diese Funktion leer bleiben
  };

  const handleImageUpload = async () => {
    const userId = await validateToken();
    console.log("UserID:", userId); // Loggen der Benutzer-ID
    console.log("Cropped File:", croppedFile); // Loggen des zugeschnittenen Bildes

    if (!userId || !croppedFile) {
      console.error("User ID oder zugeschnittenes Bild fehlen");
      return;
    }

    const formData = new FormData();
    formData.append("profileImage", croppedFile);
    formData.append("userId", userId);

    const token = localStorage.getItem("userToken");

    try {
      const response = await axios.post(
        "http://localhost:9000/api/users/upload-profile-picture",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserData({ ...userData, profileImage: response.data.profileImage });
    } catch (error) {
      console.error("Fehler beim Hochladen des Bildes:", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:9000/api/users/update",
        formData
      ); // Ändern Sie die URL entsprechend Ihrer API
      console.log(response.data);
      // Weiterer Code zur Behandlung der Antwort
    } catch (error) {
      console.error("Fehler beim Speichern der Daten:", error);
    }
  };

  // Funktion zum Hochladen eines neuen Profilbildes
  const handleProfileImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      const response = await axios.post(
        "http://localhost:9000/api/users/upload-profile-picture",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setUserData({ ...userData, profileImage: response.data.profileImageUrl });
    } catch (error) {
      console.error("Fehler beim Aktualisieren des Profilbildes:", error);
    }
  };

  return (
    <>
      <main className="bg-luckyPoint-200 dark:bg-luckyPoint-700 w-full min-h-screen py-1 md:w-2/3 lg:w-3/4">
        <div className="p-2 md:p-4">
          <div className="w-full px-6 pb-8 mt-8 sm:max-w-xl sm:rounded-lg">
            <h2 className="pl-6 text-2xl font-bold sm:text-xl">
              Public Profile
            </h2>

            <div className="grid max-w-2xl mx-auto mt-8">
              <div className="mb-6">
                <img
                  className="object-cover w-40 h-40 p-1 rounded-full ring-2 ring-luckyPoint-300 dark:ring-luckyPoint-500"
                  src={`http://localhost:9000/${userData.profileImage}`}
                  alt="Profile Avatar"
                />
                <button
                  onClick={handleProfileImageChange}
                  type="button"
                  className="py-3.5 px-7 text-base font-medium text-luckyPoint-900 focus:outline-none bg-luckyPoint-200 rounded-lg border border-luckyPoint-100 hover:bg-luckyPoint-50 hover:text-[#202142] focus:z-10 focus:ring-4 focus:ring-luckyPoint-200 "
                >
                  Delete picture
                </button>
              </div>
            </div>
            {/* Dropzone */}
            <div className="mb-6">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-luckyPoint-300 border-dashed rounded-lg cursor-pointer bg-luckyPoint-50  dark:bg-luckyPoint-700 hover:bg-luckyPoint-100 dark:border-gray-600 dark:hover:border-luckyPoint-500 dark:hover:bg-luckyPoint-600"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {profileImagePreview ? (
                    <img
                      src={profileImagePreview}
                      alt="Vorschau"
                      className="max-w-full max-h-48"
                    />
                  ) : (
                    <>
                      <svg
                        className="w-8 h-8 mb-4 text-luckyPoint-500 dark:text-luckyPoint-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 16"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 A5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                        />
                      </svg>
                      <p className="mb-2 text-sm text-luckyPoint-500 dark:text-luckyPoint-400">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-luckyPoint-500 dark:text-luckyPoint-400">
                        SVG, PNG, JPG or GIF (MAX. 800x400px)
                      </p>
                    </>
                  )}
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  name="profileImage"
                  className="hidden"
                  onChange={handleDropzoneFileChange}
                />
              </label>
              {profileImage && (
                <button
                  onClick={handleImageUpload}
                  className="mt-4 py-2 px-4 bg-luckyPoint-500 text-luckyPoint-200 rounded hover:bg-luckyPoint-700"
                >
                  Upload Image
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="items-center mt-8 sm:mt-14 text-[#202142]">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col items-center w-full mb-2 space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 sm:mb-6">
              <div className="w-full">
                <label
                  htmlFor="first_name"
                  className="block mb-2 text-sm font-medium text-luckyPoint-900 dark:text-luckyPoint-200"
                >
                  Your first name
                </label>
                <input
                  type="text"
                  id="firstName"
                  className="bg-luckyPoint-50 border border-luckyPoint-300 text-luckyPoint-900 text-sm rounded-lg focus:ring-luckyPoint-500 focus:border-luckyPoint-500 block w-full p-2.5 "
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Your first name"
                  required
                />
              </div>

              <div className="w-full">
                <label
                  htmlFor="last_name"
                  className="block mb-2 text-sm font-medium text-luckyPoint-900 dark:text-luckyPoint-200"
                >
                  Your last name
                </label>
                <input
                  type="text"
                  id="last_name"
                  className="bg-luckyPoint-50 border border-luckyPoint-300 text-luckyPoint-900 text-sm rounded-lg focus:ring-luckyPoint-500 focus:border-luckyPoint-500 block w-full p-2.5 "
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Your last name"
                  required
                />
              </div>
            </div>

            <div className="mb-2 sm:mb-6">
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-luckyPoint-900 dark:text-luckyPoint-200"
              >
                Your email
              </label>
              <input
                type="email"
                id="email"
                className="bg-luckyPoint-50 border border-luckyPoint-300 text-luckyPoint-900 text-sm rounded-lg focus:ring-luckyPoint-500 focus:border-luckyPoint-500 block w-full p-2.5 "
                placeholder="your.email@mail.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-2 sm:mb-6">
              <label
                htmlFor="profession"
                className="block mb-2 text-sm font-medium text-luckyPoint-900 dark:text-luckyPoint-200"
              >
                Profession
              </label>
              <input
                type="text"
                id="profession"
                className="bg-luckyPoint-50 border border-luckyPoint-300 text-luckyPoint-900 text-sm rounded-lg focus:ring-luckyPoint-500 focus:border-indigo-500 block w-full p-2.5 "
                placeholder="your profession"
                value={formData.profession}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="message"
                className="block mb-2 text-sm font-medium text-luckyPoint-900 dark:text-luckyPoint-200"
              >
                Bio
              </label>
              <textarea
                id="message"
                rows="4"
                className="block p-2.5 w-full text-sm text-inluckyPointdigo-900 bg-luckyPoint-50 rounded-lg border border-luckyPoint-300 focus:ring-luckyPoint-500 focus:border-luckyPoint-500 "
                placeholder="Write your bio here..."
                value={formData.bio}
                onChange={handleInputChange}
              ></textarea>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="text-luckyPoint-200 bg-luckyPoint-700  hover:bg-luckyPoint-900 focus:ring-4 focus:outline-none focus:ring-luckyPoint-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-luckyPoint-600 dark:hover:bg-luckyPoint-900 dark:focus:ring-luckyPoint-800"
                onSubmit={handleSubmit}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </main>
      {/* Crop Modal */}
      {cropModalOpen && (
        <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-luckyPoint-200 p-5 rounded-lg">
            {profileImagePreview && (
              <ReactCrop
                crop={crop}
                onImageLoaded={onImageLoaded}
                onComplete={makeClientCrop}
                onChange={handleImageCrop}
              >
                <img src={profileImagePreview} alt="Crop" />
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
    </>
  );
};

export default ProfileForm;
