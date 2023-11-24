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
  token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiI5MjhhODFkMC1kZDE3LTQzMTQtOTc3Ny0wOGQ1MzQyZTFiNzkiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTcwMDgxNjkzNCwiZXhwIjoxNzAxNDIxNzM0fQ.aXg6PO_f5ZIP96C50Jocv5_a3U10CQKgbeGSaP-b63A"
>
  <MeetingView />
</MeetingProvider>
 )
};
export default InitializeVideo;