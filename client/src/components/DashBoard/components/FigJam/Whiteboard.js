import React, { useState, useCallback, useRef } from "react";
import { Stage, Layer, Line } from "react-konva";
import Rectangle from "./structures/Rectangle";
import Circle from "./structures/Circle";
import Triangle from "./structures/Triangle";
import EditableText from "./structures/Text"; // Achte darauf, dass der Importname nicht mit dem HTML-Tag kollidiert
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faFont, faSquare } from "@fortawesome/free-solid-svg-icons";
import Icon from "@mdi/react";
import { mdiTriangleOutline } from "@mdi/js";
const gridSize = 20; // Größe der Rasterlinien

// Funktion zum Erstellen der Linien des Gitters
const createGrid = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const lines = [];

  // Vertikale Linien
  // Vertikale Linien
  for (let i = 0; i < width; i += gridSize) {
    lines.push(
      <Line
        key={`v${i}`}
        points={[i, 0, i, height]}
        stroke="#ddd"
        strokeWidth={1}
      />
    );
  }

  // Horizontale Linien
  for (let i = 0; i < height; i += gridSize) {
    lines.push(
      <Line
        key={`h${i}`}
        points={[0, i, width, i]}
        stroke="#ddd"
        strokeWidth={1}
      />
    );
  }

  return lines;
};

function Whiteboard() {
  // Zustände für die Formen
  const [shapes, setShapes] = useState({
    rectangles: [],
    circles: [],
    triangles: [],
    texts: [],
  });
  const [selectedId, setSelectedId] = useState(null);
  const stageRef = useRef(null);
  const [selectedShape, setSelectedShape] = useState(null);
  const [shapeColor, setShapeColor] = useState("#000000");

  // Funktion zum Hinzufügen von Formen (als Beispiel)
  const addShape = useCallback((shapeType) => {
    console.log(`Adding ${shapeType}`);
    let newShape = {}; // Initialisiere newShape als leeres Objekt
    const id = Date.now().toString();
    newShape.id = id;

    let maxX = window.innerWidth;
    let maxY = window.innerHeight;

    switch (shapeType) {
      case "rectangles":
        newShape = {
          ...newShape, // Bewahre bereits gesetzte Eigenschaften (wie 'id')
          width: 100,
          height: 100,
          fill: "red",
        };
        maxX -= newShape.width;
        maxY -= newShape.height;
        break;

      case "circles":
        newShape = {
          radius: 50,
          fill: "blue",
        };
        maxX -= newShape.radius * 2;
        maxY -= newShape.radius * 2;
        break;
      case "triangles":
        newShape = {
          width: 100,
          height: 100,
          fill: "#00D2FF",
        };
        maxX -= newShape.width;
        maxY -= newShape.height * 0.75;
        break;
      case "texts":
        newShape = {
          text: "Edit Me",
          fontSize: 20,
          fill: "black",
        };
        // Annahme: ungefähre Abmessungen für den Text hinzufügen
        maxX -= 100; // Schätzen Sie die Breite für "Edit Me"
        maxY -= newShape.fontSize; // Verwenden Sie die Schriftgröße für die Höhe
        break;
      default:
        console.error("Unknown shape type:", shapeType);
        return;
    }

    // Setze x und y so, dass sie innerhalb des sichtbaren Bereichs bleiben
    newShape.x = Math.random() * maxX;
    newShape.y = Math.random() * maxY;

    // Aktualisiere den Zustand mit der neuen Form
    setShapes((prevShapes) => ({
      ...prevShapes,
      [shapeType]: [...prevShapes[shapeType], newShape],
    }));
  }, []);

  const handleShapeChange = useCallback((shapeType, index, newProps) => {
    setShapes((prevShapes) => {
      const updatedShapes = [...prevShapes[shapeType]];
      const shape = updatedShapes[index];

      // Berechne die maximal zulässigen x und y Werte
      const maxX =
        window.innerWidth -
        (shapeType === "circles" ? shape.radius : shape.width);
      const maxY =
        window.innerHeight -
        (shapeType === "circles" ? shape.radius : shape.height);

      // Aktualisiere die Form mit den neuen Eigenschaften, begrenze aber x und y
      updatedShapes[index] = {
        ...shape,
        ...newProps,
        // Begrenzung der neuen Position innerhalb der sichtbaren Bühne
        x: Math.min(Math.max(newProps.x, 0), maxX),
        y: Math.min(Math.max(newProps.y, 0), maxY),
      };

      return { ...prevShapes, [shapeType]: updatedShapes };
    });
  }, []);

  const checkDeselect = (e) => {
    // Deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedId(null);
    }
  };

  return (
    <div className="flex">
      <div className="w-64 h-screen bg-gray-800 text-white p-4">
        {" "}
        {/* Sidebar */}
        <div className="flex flex-col items-center space-y-4">
          {" "}
          {/* Sidebar */}
          <button
            onClick={() => addShape("rectangles")}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            <FontAwesomeIcon icon={faSquare} className="center" />
          </button>
          <button
            onClick={() => addShape("circles")}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            <FontAwesomeIcon icon={faCircle} className="center" />
          </button>
          <button
            onClick={() => addShape("triangles")}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            <Icon path={mdiTriangleOutline} size={0.6} />
          </button>
          <button
            onClick={() => addShape("texts")}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            <FontAwesomeIcon icon={faFont} />
          </button>
        </div>
        <div className="flex-1">
          {" "}
          {/* Hauptbereich */}
          {/* Ihr Zeichenbereich und weitere Inhalte */}
        </div>
      </div>

      {/* Schaltflächen zum Hinzufügen von Formen */}

      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={checkDeselect}
        onTouchStart={checkDeselect}
      >
        <Layer>{createGrid()}</Layer>
        <Layer>
          {/* Hier renderst du deine Formen */}
          {shapes.rectangles.map((shape, i) => (
            <Rectangle
              key={shape.id}
              shapeProps={shape}
              isSelected={shape.id === selectedId}
              onSelect={() => setSelectedId(shape.id)}
              onChange={(newProps) =>
                handleShapeChange("rectangles", i, newProps)
              }
            />
          ))}

          {shapes.circles.map((shape, i) => (
            <Circle
              key={shape.id}
              shapeProps={shape}
              isSelected={shape.id === selectedId}
              onSelect={() => setSelectedId(shape.id)}
              onChange={(newProps) => handleShapeChange("circles", i, newProps)}
            />
          ))}

          {shapes.triangles.map((shape, i) => (
            <Triangle
              key={shape.id}
              shapeProps={shape}
              isSelected={shape.id === selectedId}
              onSelect={() => setSelectedId(shape.id)}
              onChange={(newProps) =>
                handleShapeChange("triangles", i, newProps)
              }
            />
          ))}

          {shapes.texts.map((text, i) => (
            <EditableText
              key={text.id} // Ensure text.id is unique
              shapeProps={text}
              isSelected={text.id === selectedId}
              onSelect={() => setSelectedId(text.id)}
              onChange={(newProps) => handleShapeChange("texts", i, newProps)}
              stageRef={stageRef}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}

export default Whiteboard;
