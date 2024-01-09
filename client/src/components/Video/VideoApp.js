import { MeetingProvider } from "@videosdk.live/react-sdk";
import { useEffect } from "react";
import { useState } from "react";
import { MeetingAppProvider } from "./MeetingAppContextDef";
import { MeetingContainer } from "./meeting/MeetingContainer";
import { LeaveScreen } from "./components/screens/LeaveScreen";
import { JoiningScreen } from "./components/screens/JoiningScreen";
import axios from "axios";
import { createMeeting, getToken } from "./api";
import "./styles/video.css";

function VideoApp(channelId) {
  const [token, setToken] = useState("");
  const [meetingId, setMeetingId] = useState("");
  const [participantName, setParticipantName] = useState("");
  const [micOn, setMicOn] = useState(true);
  const [webcamOn, setWebcamOn] = useState(true);
  const [selectedMic, setSelectedMic] = useState({ id: null });
  const [selectedWebcam, setSelectedWebcam] = useState({ id: null });
  const [selectWebcamDeviceId, setSelectWebcamDeviceId] = useState(
    selectedWebcam.id
  );

  const [selectMicDeviceId, setSelectMicDeviceId] = useState(selectedMic.id);
  const [isMeetingStarted, setIsMeetingStarted] = useState(false);
  const [isMeetingLeft, setIsMeetingLeft] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const isMobile = window.matchMedia(
    "only screen and (max-width: 768px)"
  ).matches;

  // Hinzugefügte Funktion, um automatisch ein Meeting zu starten
  useEffect(() => {
    // fetch current user information
    const fetchMeetingInfo = async () => {
      try {
        const token = localStorage.getItem("userToken");
        const userId = await validateToken();
        const response = await axios.get("http://localhost:9000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
          params: { userId: userId },
        });
        setParticipantName(response.data.name);
        console.log("Aktuelle Benutzer-ID:", response.data.name); // Zur Diagnose hinzugefügt
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const autoStartMeeting = async () => {
      try {
        // Überprüfen, ob ein aktives Meeting vorhanden ist
        const existingMeetingResponse = await axios.get(
          `http://localhost:9000/api/channels/${channelId.channelId}/meetingId`
        );
        setMeetingId(existingMeetingResponse.data.meetingId);
        const meetingId = existingMeetingResponse.data.meetingId;
        // Wenn keine Meeting-ID vorhanden ist, wird ein neues Meeting erstellt
        if (meetingId === null) {
          const token = await getToken();
          const meetingId = await createMeeting({ token });
          setToken(token);
          setMeetingId(meetingId);
          postMeetingIdToBackend(meetingId);
          fetchMeetingInfo();
          setIsMeetingStarted(true);
        } else {
          fetchMeetingInfo();
          const token = await getToken();
          setToken(token);
          setIsMeetingStarted(true);
        }
      } catch (error) {
        console.error("Fehler beim Starten des Meetings:", error);
      }
    };

    autoStartMeeting();
  }, []);

  async function postMeetingIdToBackend(meetingId) {
    try {
      console.log("the current Channel is: ", channelId.channelId);
      const response = await axios.put(
        `http://localhost:9000/api/channels/${channelId.channelId}/addMeeting`,
        {
          meetingId: meetingId,
        }
      );
      console.log("Meeting-ID an Backend gesendet:", response.data.meetingId);
    } catch (error) {
      console.error("Fehler beim Senden der Meeting-ID an das Backend:", error);
    }
  }

  useEffect(() => {
    if (isMobile) {
      window.onbeforeunload = () => {
        return "Are you sure you want to exit?";
      };
    }
  }, [isMobile]);

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

  useEffect(() => {
    if (isMobile) {
      window.onbeforeunload = () => "Are you sure you want to exit?";
    }
  }, [isMobile]);

  return (
    <>
      {isMeetingStarted ? (
        <MeetingAppProvider
          selectedMic={selectedMic}
          selectedWebcam={selectedWebcam}
          initialMicOn={micOn}
          initialWebcamOn={webcamOn}
        >
          <MeetingProvider
            config={{
              meetingId,
              micEnabled: micOn,
              webcamEnabled: webcamOn,
              name: participantName,

              multiStream: true,
            }}
            token={token}
            reinitialiseMeetingOnConfigChange={true}
            joinWithoutUserInteraction={true}
          >
            <MeetingContainer
              onMeetingLeave={() => {
                setToken("");
                setMeetingId("");
                setParticipantName("");
                setWebcamOn(false);
                setMicOn(false);
                setIsMeetingStarted(false);
              }}
              setIsMeetingLeft={setIsMeetingLeft}
              selectedMic={selectedMic}
              selectedWebcam={selectedWebcam}
              selectWebcamDeviceId={selectWebcamDeviceId}
              setSelectWebcamDeviceId={setSelectWebcamDeviceId}
              selectMicDeviceId={selectMicDeviceId}
              setSelectMicDeviceId={setSelectMicDeviceId}
              micEnabled={micOn}
              webcamEnabled={webcamOn}
            />
          </MeetingProvider>
        </MeetingAppProvider>
      ) : isMeetingLeft ? (
        <LeaveScreen setIsMeetingLeft={setIsMeetingLeft} />
      ) : (
        <JoiningScreen
          meetingId={meetingId}
          token={token}
          participantName={participantName}
          setParticipantName={setParticipantName}
          setMeetingId={setMeetingId}
          setToken={setToken}
          setMicOn={setMicOn}
          micEnabled={micOn}
          webcamEnabled={webcamOn}
          setSelectedMic={setSelectedMic}
          setSelectedWebcam={setSelectedWebcam}
          setWebcamOn={setWebcamOn}
          onClickStartMeeting={() => {
            // fetchMeetingInfo();
            setIsMeetingStarted(true);
          }}
          startMeeting={isMeetingStarted}
          setIsMeetingLeft={setIsMeetingLeft}
        />
      )}
    </>
  );
}

export default VideoApp;
