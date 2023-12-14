import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
const WorkspaceDropdown = () => {
  const [rotation, setRotation] = useState(0);
  const [items, setItems] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const allowScroll = useRef(true);
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWorkspaceIndex, setSelectedWorkspaceIndex] = useState(0);
  const defaultImageUrl =
    "https://images.unsplash.com/photo-1702016049560-3d3f27b0071e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  const baseUrl = "http://localhost:9000/";

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

  const handleWorkspaceClick = (index) => {
    setSelectedWorkspaceIndex(index);
    // Weitere Aktionen, um den ausgewählten Workspace zu setzen, können hier hinzugefügt werden
  };

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
    if (!allowScroll.current) return;

    allowScroll.current = false;
    setTimeout(() => {
      allowScroll.current = true;
    }, 500);

    if (e.deltaY > 0) {
      setRotation((prevRotation) => prevRotation - 90);
    } else {
      setRotation((prevRotation) => prevRotation + 90);
    }
  };

  useEffect(() => {
    const cubeElement = document.querySelector(".cube");
    cubeElement.addEventListener("wheel", handleScroll);

    return () => {
      cubeElement.removeEventListener("wheel", handleScroll);
    };
  }, []);

  const cubeStyle = {
    width: "10em",
    height: "10em",
    perspective: "10em",
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
    lineHeight: "10em",
    textAlign: "center",
  };

  const calculateRotationAngle = (index, total) => {
    const angle = 360 / total;
    return index * angle;
  };

  // Anpassung für das Anzeigen von Workspaces in den Seiten des Würfels
  const renderFaces = () => {
    const faces = ["front", "back", "top", "bottom"];
    return workspaces.map((workspace, index) => {
      const faceIndex = index % faces.length;
      let transform;

      switch (faces[faceIndex]) {
        case "front":
          transform = "rotateY(0deg) translateZ(5em) rotateX(0deg)";
          break;
        case "back":
          transform =
            "rotateY(180deg) translateZ(5em) rotateY(180deg) rotateX(180deg)";
          break;
        case "top":
          transform = "rotateX(90deg) translateZ(5em) rotateZ(360deg)";
          break;
        case "bottom":
          transform = "rotateX(-90deg) translateZ(5em) rotateZ(360deg)";
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
          onClick={() => handleWorkspaceClick(index)}
        >
          {workspace.name}
        </div>
      );
    });
  };

  return (
    <div style={cubeStyle}>
      <div className="cube" style={cubeInnerStyle}>
        {renderFaces()}
      </div>
    </div>
  );
};

export default WorkspaceDropdown;
