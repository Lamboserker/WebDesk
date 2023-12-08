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
      if (isMeetingStarted=== true) {
        return;
      };
      try {
        // Überprüfen, ob ein aktives Meeting vorhanden ist
        const existingMeetingResponse = await axios.get(
          `http://localhost:9000/api/channels/${channelId.channelId}/meetingId`
        );
       
        
       
        // Wenn keine Meeting-ID vorhanden ist, wird ein neues Meeting erstellt
        if (meetingId === "") {
          const token = await getToken();
          const meetingId = await createMeeting({ token });
          setToken(token);
          setMeetingId(meetingId);
          postMeetingIdToBackend(meetingId);
          setIsMeetingStarted(true);	
        } else {
          fetchMeetingInfo();
          const token = await getToken();
          setToken(token);
          setMeetingId(existingMeetingResponse.data.meetingId);
          setIsMeetingStarted(true);
        }
      } catch (error) {
        console.error("Fehler beim Starten des Meetings:", error);
      }
    };

    autoStartMeeting();
  }, []);
