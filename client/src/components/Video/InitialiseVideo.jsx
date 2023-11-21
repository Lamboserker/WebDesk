import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  MeetingProvider,
  useMeeting,
  useParticipant,
} from "@videosdk.live/react-sdk";
import ReactPlayer from "react-player";

function MeetingView() {
    return null
}
const InitializeVideo = () => {
 return (
  <MeetingProvider
  config={{
    meetingId: "srdd-r9is-y9rd",
    micEnabled: true,
    webcamEnabled: true,
    name: "Lukas's Org",
  }}
  token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiI5MjhhODFkMC1kZDE3LTQzMTQtOTc3Ny0wOGQ1MzQyZTFiNzkiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTcwMDQ4NTA0NSwiZXhwIjoxNzAwNTcxNDQ1fQ.BpoI0y6dshiBpIoVY6gJQ9g4hjn9XdTUWdS067z8Ia4"
>
  <MeetingView />
</MeetingProvider>
 )
};
export default InitializeVideo;