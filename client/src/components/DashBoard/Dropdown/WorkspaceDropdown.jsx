import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { WorkspaceContext } from "../../../Context/WorkspaceContext";

const WorkspaceDropdown = () => {
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
    // Laden des gespeicherten Workspace beim Initialisieren
    const savedWorkspaceId = localStorage.getItem("lastVisitedWorkspace");
    if (savedWorkspaceId) {
      setSelectedWorkspace(savedWorkspaceId); // Stellen Sie sicher, dass dieser Aufruf korrekt den Workspace setzt
    }
  }, []);

  useEffect(() => {
    // Speichern des ausgewählten Workspace im localStorage
    localStorage.setItem("lastVisitedWorkspace", selectedWorkspace);
  }, [selectedWorkspace]);

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

  const cubeStyle = {
    width: "7.5em",
    height: "7.5em",
    perspective: "7.5em",
  };

  const cubeInnerStyle = {
    width: "100%",
    height: "100%",
    position: "relative",
    transformStyle: "preserve-3d",
    transition: "transform 0.6s",
    transform: `translateZ(-5em) rotateX(${rotation}deg)`,
  };

  const faceStyle = {
    boxShadow: "0px 25px 20px -20px rgba(0,0,0,0.45)",
    width: "100%",
    height: "100%",
    position: "absolute",
    border: "1px solid #333",
    color: "#FFF",
    lineHeight: "3.75em",
    textAlign: "center",
    fontWeight: "bold",
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
      return (
        <div
          className="rounded-md"
          key={workspace.id}
          style={{
            ...faceStyle,
            transform,
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: "cover",
          }}
        >
          {workspace.name}
        </div>
      );
    });
  };

  return (
    <div className="w-full">
      <div style={cubeStyle}>
        <div className="cube" style={cubeInnerStyle}>
          {renderFaces()}
        </div>
      </div>
    </div>
  );
};

export default WorkspaceDropdown;
