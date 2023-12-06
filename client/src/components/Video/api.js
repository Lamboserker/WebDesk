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
      const res = await fetch(`${API_AUTH_URL}/api/video/get-token`, {
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

export const createMeeting = async ({ token, channelId }) => {
  const url = `${API_BASE_URL}/api/video/create-room`;
  const options = {
    method: "POST",
    headers: { Authorization: token, "Content-Type": "application/json" },
    body: JSON.stringify({ channelId }), // Include channelId in the request body
  };

  const response = await fetch(url, options);
  const result = await response.json();
  return result.roomId;
};

export const validateMeeting = async ({ roomId, token, channelId }) => {
  const url = `${API_BASE_URL}/api/video/validate-meeting/${roomId}`;
  const options = {
    method: "POST",
    headers: { Authorization: token, "Content-Type": "application/json" },
    body: JSON.stringify({ channelId }), // Include channelId in the request body
  };

  const response = await fetch(url, options);
  const result = await response.json();
  return result.isValid;
};
