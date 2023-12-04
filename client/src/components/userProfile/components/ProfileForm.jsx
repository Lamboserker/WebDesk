import { useState, useEffect } from "react";
import axios from "axios";

const ProfileForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    profession: "",
    bio: "",
  });
  const [userData, setUserData] = useState({});
  const [profileImage, setProfileImage] = useState("");



  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleImageUpload = async () => {
    const formData = new FormData();
    formData.append("image", profileImage);
    const token = localStorage.getItem("userToken"); // Annahme: Token ist im Local Storage gespeichert
  
    try {
      const response = await axios.post(
        "http://localhost:9000/api/users/upload-profile-picture",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`, // Fügen Sie den JWT-Token im Authorization-Header hinzu
          },
        }
      );
      setProfileImage(response.data.profileImage); // Aktualisieren Sie hier die Bild-URL
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
        "http://localhost:9000/api/user/update",
        formData
      ); // Ändern Sie die URL entsprechend Ihrer API
      console.log(response.data);
      // Weiterer Code zur Behandlung der Antwort
    } catch (error) {
      console.error("Fehler beim Speichern der Daten:", error);
    }
  };

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
      <main className="w-full min-h-screen py-1 md:w-2/3 lg:w-3/4">
        <div className="p-2 md:p-4">
          <div className="w-full px-6 pb-8 mt-8 sm:max-w-xl sm:rounded-lg">
            <h2 className="pl-6 text-2xl font-bold sm:text-xl">
              Public Profile
            </h2>

            <div className="grid max-w-2xl mx-auto mt-8">
              <div className="flex flex-col items-center space-y-5 sm:flex-row sm:space-y-0">
                <img
                  className="object-cover w-40 h-40 p-1 rounded-full ring-2 ring-indigo-300 dark:ring-indigo-500"
                  src={userData.profileImage || "default_profile_image_url"} // Ersetzen Sie "default_profile_image_url" durch eine Standardbild-URL
                  alt="Profile Avatar"
                />

                <div className="flex flex-col space-y-5 sm:ml-8">
                  <div>
                    <input type="file" onChange={handleImageChange}  placeholder="upload image" className="py-3.5 px-7 text-base font-medium text-indigo-100 focus:outline-none bg-[#202142] rounded-lg border border-indigo-200 hover:bg-indigo-900 focus:z-10 focus:ring-4 focus:ring-indigo-200"/>
                    <button onClick={handleImageUpload} className="py-3.5 px-7 text-base font-medium text-indigo-100 focus:outline-none bg-[#202142] rounded-lg border border-indigo-200 hover:bg-indigo-900 focus:z-10 focus:ring-4 focus:ring-indigo-200">Upload Image</button>
                    {profileImage && (
                      <img src={profileImage} alt="Profilbild" />
                    )}
                  </div>
                  <button
                  onChange={handleProfileImageChange}
                    type="button"
                    className="py-3.5 px-7 text-base font-medium text-indigo-900 focus:outline-none bg-white rounded-lg border border-indigo-200 hover:bg-indigo-100 hover:text-[#202142] focus:z-10 focus:ring-4 focus:ring-indigo-200 "
                  >
                    Delete picture
                  </button>
                </div>
              </div>

              <div className="items-center mt-8 sm:mt-14 text-[#202142]">
                <form onSubmit={handleSubmit}>
                  <div className="flex flex-col items-center w-full mb-2 space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 sm:mb-6">
                    <div className="w-full">
                      <label
                        for="first_name"
                        className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white"
                      >
                        Your first name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 "
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="Your first name"
                        required
                      />
                    </div>

                    <div className="w-full">
                      <label
                        for="last_name"
                        className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white"
                      >
                        Your last name
                      </label>
                      <input
                        type="text"
                        id="last_name"
                        className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 "
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Your last name"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-2 sm:mb-6">
                    <label
                      for="email"
                      className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white"
                    >
                      Your email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 "
                      placeholder="your.email@mail.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="mb-2 sm:mb-6">
                    <label
                      for="profession"
                      className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white"
                    >
                      Profession
                    </label>
                    <input
                      type="text"
                      id="profession"
                      className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 "
                      placeholder="your profession"
                      value={formData.profession}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="mb-6">
                    <label
                      for="message"
                      className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white"
                    >
                      Bio
                    </label>
                    <textarea
                      id="message"
                      rows="4"
                      className="block p-2.5 w-full text-sm text-indigo-900 bg-indigo-50 rounded-lg border border-indigo-300 focus:ring-indigo-500 focus:border-indigo-500 "
                      placeholder="Write your bio here..."
                      value={formData.bio}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="text-white bg-indigo-700  hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
                      onSubmit={handleSubmit}
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default ProfileForm;
