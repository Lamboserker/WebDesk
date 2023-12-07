const API_BASE_URL = "https://api.videosdk.live";
const VIDEOSDK_TOKEN = process.env.REACT_APP_VIDEOSDK_TOKEN;
const API_AUTH_URL = process.env.REACT_APP_AUTH_URL;

export const getToken = async () => {
  if (VIDEOSDK_TOKEN && API_AUTH_URL) {
    console.error(
      "Error: Provide only ONE PARAMETER - either Token or Auth API"
    );
  } else if (VIDEOSDK_TOKEN) {
    return VIDEOSDK_TOKEN;
  } else if (API_AUTH_URL) {
    try {
      const res = await fetch(`http://localhost:9000/api/video/get-token`, {
        method: "GET",
      });
      const { token } = await res.json();
      console.log(token);
      return token;
    } catch (error) {
      console.log(error.message);
    }
  } else {
    console.error("Error: ", Error("Please add a token or Auth Server URL"));
  }
};
export const createMeeting = async ({ token }) => {
  const url = `${API_BASE_URL}/v2/rooms`;
  const options = {
    method: "POST",
    headers: { Authorization: token, "Content-Type": "application/json" },
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data.roomId; // Assuming the response contains a roomId
  } catch (error) {
    console.error("Error creating meeting:", error.message);
    return null; // Return null or appropriate error handling
  }
};
export const validateMeeting = async ({ roomId, token }) => {
  const url = `${API_BASE_URL}/v2/rooms/validate/${roomId}`;
  const options = {
    method: "GET",
    headers: { Authorization: token, "Content-Type": "application/json" },
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const result = await response.json();
    return result && result.roomId === roomId; // Verify if the response matches the roomId
  } catch (error) {
    console.error("Error validating meeting:", error.message);
    return false; // Return false or appropriate error handling
  }
};
