import React, { useState, useCallback, useRef } from "react";
import { Stage, Layer, Line } from "react-konva";
import Rectangle from "./structures/Rectangle";
import Circle from "./structures/Circle";
import Triangle from "./structures/Triangle";
import EditableText from "./structures/Text"; // Achte darauf, dass der Importname nicht mit dem HTML-Tag kollidiert
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircle,
  faFont,
  faSquare,
  faPencilAlt,
} from "@fortawesome/free-solid-svg-icons";
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
  const [shapes, setShapes] = useState({
    rectangles: [],
    circles: [],
    triangles: [],
    texts: [],
    FreeDraw: [],
  });
  const [tool, setTool] = useState("pen"); // Zustand für das ausgewählte Werkzeug
  const [lines, setLines] = useState([]); // Zustand für die Linien
  const [selectedId, setSelectedId] = useState(null);
  const [, setMode] = useState("select"); // Zustand für den aktuellen Modus
  const stageRef = useRef(null);
  const isDrawing = useRef(false);
  const [color, setColor] = useState("#df4b26"); // Zustand für die Farbe
  const [strokeWidth, setStrokeWidth] = useState(5); // Zustand für die Strichstärke

  const handleColorChange = (newColor) => {
    setColor(newColor.hex);
  };

  const handleStrokeWidthChange = (newWidth) => {
    setStrokeWidth(newWidth);
  };

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
      case "freedraw":
        newShape = {
          tool: "pen",
          points: [],
        };
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

  // const checkDeselect = (e) => {
  //   // Deselect when clicked on empty area
  //   const clickedOnEmpty = e.target === e.target.getStage();
  //   if (clickedOnEmpty) {
  //     setSelectedId(null);
  //   }
  // };

  const handleFreeDrawClick = () => {
    setMode("freedraw"); // Setzt den Modus auf Freihandzeichnen
  };

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    // Speichern Sie die aktuelle Farbe und Strichstärke zusammen mit den Punkten
    setLines([
      ...lines,
      { tool, points: [pos.x, pos.y], color: color, strokeWidth: strokeWidth },
    ]);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current) {
      return;
    }
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    // Fügen Sie dem letzten Linienobjekt Punkte hinzu
    lastLine.points = lastLine.points.concat([point.x, point.y]);
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  return (
    <div className="flex h-screen  overflow-hidden">
      {/* Sidebar mit Schaltflächen zum Hinzufügen von Formen und Umschalten des Modus */}
      <div className="w-64 h-screen bg-gray-800 text-white p-4">
        <div className="flex flex-col items-center space-y-4">
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
          {/* Schaltfläche zum Aktivieren des Freihandzeichnen-Modus */}
          <button
            onClick={handleFreeDrawClick}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            <FontAwesomeIcon icon={faPencilAlt} />
          </button>
          {/* Werkzeugauswahl */}
          <select
            value={tool}
            onChange={(e) => setTool(e.target.value)} /* ... */
          >
            <option value="pen">Pen</option>
            <option value="eraser">Eraser</option>
          </select>

          <input
            type="color"
            value={color}
            onChange={(e) => handleColorChange({ hex: e.target.value })}
            className="w-full h-8 border-none"
          />
          <input
            type="range"
            min="1"
            max="20"
            value={strokeWidth}
            onChange={(e) => handleStrokeWidthChange(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* Hauptbereich für das Zeichnen */}
      <div className="relative max-w-full max-h-screen overflow-auto">
        <Stage
          width={window.innerWidth}
          height={window.innerHeight}
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onMouseup={handleMouseUp}
          ref={stageRef}
        >
          <Layer>{createGrid()}</Layer>
          <Layer>
            {lines.map((line, i) => (
              <Line
                key={i}
                points={line.points}
                stroke={line.color} // Verwenden Sie die Farbe aus dem Linienobjekt
                strokeWidth={line.strokeWidth} // Verwenden Sie die Strichstärke aus dem Linienobjekt
                tension={0.5}
                lineCap="round"
                lineJoin="round"
                globalCompositeOperation={
                  line.tool === "eraser" ? "destination-out" : "source-over"
                }
              />
            ))}

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
                onChange={(newProps) =>
                  handleShapeChange("circles", i, newProps)
                }
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
                key={text.id}
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
    </div>
  );
}

export default Whiteboard;
