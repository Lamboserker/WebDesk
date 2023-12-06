import { MeetingProvider } from "@videosdk.live/react-sdk";
import { useEffect } from "react";
import { useState } from "react";
import { MeetingAppProvider } from "./MeetingAppContextDef";
import { MeetingContainer } from "./meeting/MeetingContainer";
import { LeaveScreen } from "./screens/LeaveScreen";
import { JoiningScreen } from "./screens/JoiningScreen";
import axios from "axios";

function VideoApp({ getToken, createMeeting }) {
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
  const [isMeetingStarted, setMeetingStarted] = useState(false);
  const [isMeetingLeft, setIsMeetingLeft] = useState(false);

  const isMobile = window.matchMedia(
    "only screen and (max-width: 768px)"
  ).matches;

  // Hinzugefügte Funktion, um automatisch ein Meeting zu starten
  useEffect(() => {
    const autoStartMeeting = async () => {
      try {
        const token = await getToken();
        const meetingId = await createMeeting({ token });
        setToken(token);
        setMeetingId(meetingId);
        setMeetingStarted(true);
      } catch (error) {
        console.error("Fehler beim Starten des Meetings:", error);
      }
    };

    fetchParticipantName();
    autoStartMeeting();
  }, []);

  useEffect(() => {
    if (isMobile) {
      window.onbeforeunload = () => {
        return "Are you sure you want to exit?";
      };
    }
  }, [isMobile]);

  // Funktion, um den Teilnehmernamen zu holen
  const fetchParticipantName = async () => {
    // Logik zum Abrufen des Teilnehmernamens
    setParticipantName("Ihr Teilnehmername");
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
  const fetchMeetingInfo = async () => {
    try {
      const token = localStorage.getItem("userToken");
      const userId = await validateToken();
      const response = await axios.get("http://localhost:9000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
        params: { userId: userId },
      });
      setParticipantName(response.data.name);
      console.log("Aktuelle Benutzer-ID:", participantName); // Zur Diagnose hinzugefügt
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  fetchMeetingInfo();

  useEffect(() => {
    fetchParticipantName();
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
              name: participantName ? participantName : "TestUser",

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
                setMeetingStarted(false);
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
            fetchMeetingInfo();
            setMeetingStarted(true);
          }}
          startMeeting={isMeetingStarted}
          setIsMeetingLeft={setIsMeetingLeft}
        />
      )}
    </>
  );
}

export default VideoApp;
