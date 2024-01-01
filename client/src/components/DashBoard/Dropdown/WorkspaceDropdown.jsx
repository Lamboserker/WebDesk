import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { WorkspaceContext } from "../../../Context/WorkspaceContext";

const WorkspaceDropdown = ({ sidebarWidth, setShowWorkspaceOverview }) => {
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(null);
  const [enableScroll, setEnableScroll] = useState(true); // Zustand für das Scrolling

  const [rotation, setRotation] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const allowScroll = useRef(true);
  const [workspaces, setWorkspaces] = useState([]);
  const defaultImageUrl =
    "https://images.unsplash.com/photo-1702016049560-3d3f27b0071e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  const baseUrl = "http://localhost:9000/";
  const { selectedWorkspace, setSelectedWorkspace } =
    useContext(WorkspaceContext);

  useEffect(() => {
    const savedWorkspaceId = localStorage.getItem("selectedWorkspaceId");
    if (savedWorkspaceId) {
      setSelectedWorkspaceId(savedWorkspaceId);
      // Stellen Sie sicher, dass die Funktion oder Logik hier den Workspace im Kontext aktualisiert
      setSelectedWorkspace(savedWorkspaceId);
    }
  }, []);

  useEffect(() => {
    if (selectedWorkspaceId) {
      localStorage.setItem("selectedWorkspaceId", selectedWorkspaceId);
    }
  }, [selectedWorkspaceId]);

  // Aktualisierte useEffect-Hook
  useEffect(() => {
    if (workspaces.length === 1) {
      setSelectedWorkspaceId(workspaces[0].id);
      setEnableScroll(false); // Deaktiviert Scrolling, wenn nur ein Workspace vorhanden ist
    } else {
      setEnableScroll(true); // Aktiviert Scrolling, wenn mehr als ein Workspace vorhanden ist
    }
  }, [workspaces]);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const token = localStorage.getItem("userToken");
        const response = await axios.get(
          "http://localhost:9000/api/workspaces/list",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setWorkspaces(response.data);
      } catch (error) {
        console.error("Error fetching workspaces", error);
      }
    };

    fetchWorkspaces();
  }, []);

  const handleScroll = (e) => {
    if (!allowScroll.current || workspaces.length === 0) return;

    allowScroll.current = false;
    setTimeout(() => {
      allowScroll.current = true;
    }, 500);

    if (e.deltaY > 0) {
      setRotation((prevRotation) => prevRotation - 90);
      setSelectedIndex((prevIndex) => (prevIndex + 1) % workspaces.length);
    } else {
      setRotation((prevRotation) => prevRotation + 90);
      setSelectedIndex(
        (prevIndex) => (prevIndex - 1 + workspaces.length) % workspaces.length
      );
    }
  };

  useEffect(() => {
    if (workspaces.length > 0 && workspaces[selectedIndex]) {
      setSelectedWorkspace(workspaces[selectedIndex]._id);
    }
  }, [selectedIndex, workspaces]);

  useEffect(() => {
    const cubeElement = document.querySelector(".cube");
    if (cubeElement) {
      cubeElement.addEventListener("wheel", handleScroll);
    }
    return () => {
      cubeElement.removeEventListener("wheel", handleScroll);
    };
  }, [workspaces]);

  // Konstante Höhe für den Quader
  const cubeHeight = 150; // Beispielhöhe, kann nach Bedarf angepasst werden

  // Die Breite des Quaders anpassen, basierend auf der Breite der Sidebar
  const cubeWidth = Math.min(sidebarWidth, 400); // Beispiel, passt sich an die Sidebar-Breite an

  const dropdownStyle = {
    width: `${sidebarWidth}px`,
    maxWidth: `${sidebarWidth}px`,
    overflow: "hidden",
  };

  const cubeStyle = {
    width: `${cubeWidth}px`,
    height: `${cubeHeight}px`,
    perspective: "1000px", // Beispielwert für die Perspektive, kann angepasst werden
  };

  const cubeInnerStyle = {
    width: "100%",
    height: "100%",
    position: "relative",
    transformStyle: "preserve-3d",
    transition: "transform 0.6s",
    transform: `rotateX(${rotation}deg)`,
  };

  const faceStyle = {
    boxShadow: "0px 25px 20px -20px rgba(0,0,0,0.45)",
    width: `${cubeWidth}px`,
    height: `${cubeHeight}px`,
    position: "absolute",
    border: "1px solid #333",
    color: "#FFF",
    display: "flex",
    justifyContent: "center",
    alignItems: "end",
    textAlign: "center",
    fontWeight: "bold",
    backgroundSize: "cover",
    backfaceVisibility: "hidden",
  };

  // Anpassung für das Anzeigen von Workspaces in den Seiten des Würfels
  const renderFaces = () => {
    const faces = ["front", "back", "top", "bottom"];
    return workspaces.map((workspace, index) => {
      const faceIndex = index % faces.length;
      let transform;

      switch (faces[faceIndex]) {
        case "front":
          transform = "rotateY(0deg) translateZ(3.75em) rotateX(0deg)";
          break;
        case "back":
          transform =
            "rotateY(180deg) translateZ(3.75em) rotateY(180deg) rotateX(180deg)";
          break;
        case "top":
          transform = "rotateX(90deg) translateZ(3.75em) rotateZ(360deg)";
          break;
        case "bottom":
          transform = "rotateX(-90deg) translateZ(3.75em) rotateZ(360deg)";
          break;
        default:
          transform = "";
      }
      const imageUrl = workspace.image
        ? `${baseUrl}${workspace.image.replace(/\\/g, "/")}`
        : defaultImageUrl;

      const handleWorkspaceSelection = (workspaceId) => {
        // ... bestehende Auswahllogik ...
        setShowWorkspaceOverview(true); // Zeigen Sie die WorkspaceOverview an, wenn ein Arbeitsbereich ausgewählt wird
      };

      return (
        <div
          className="rounded-md"
          key={workspace.id}
          style={{
            ...faceStyle,
            transform,
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: "cover",
            fontFamily: "rubik doodle shadow",
            fontSize: "20px",
            padding: "10px",
            backgroundColor: "#4CAF50", // Hintergrundfarbe für den Namen
            color: "white", // Textfarbe, falls erforderlich
          }}
        >
          {workspace.name}
        </div>
      );
    });
  };

  return (
    <div style={dropdownStyle}>
      <div style={cubeStyle}>
        <div className="cube" style={cubeInnerStyle}>
          {renderFaces()}
        </div>
      </div>
    </div>
  );
};

export default WorkspaceDropdown;
