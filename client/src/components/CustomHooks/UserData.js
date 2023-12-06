import { useState, useEffect } from "react";
import axios from "axios";

export const useDynamicUserData = (requestedFields = [], format = "object") => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const validateToken = async () => {
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
  };

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("userToken");
      const userId = await validateToken();
      console.log("Aktuelle Benutzer-ID:", userId);
      const response = await axios.get("http://localhost:9000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
        params: { userId: userId },
      });

      const fetchedData = {
        _id: userId,
        name: response.data.name,
        profileImage: response.data.profileImage,
        // Fügen Sie hier weitere Benutzerdaten hinzu
      };

      // Extrahieren Sie nur die angeforderten Felder
      const extractedData = requestedFields.reduce((acc, field) => {
        acc[field] = fetchedData[field];
        return acc;
      }, {});

      // Formatieren Sie die Daten entsprechend dem angeforderten Format
      switch (format) {
        case "array":
          setUserData(Object.values(extractedData));
          break;
        case "string":
          setUserData(JSON.stringify(extractedData));
          break;
        default:
          setUserData(extractedData);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [requestedFields, format, ]);

  return { userData, isLoading, error };
};
