import React, { useRef, useEffect } from "react";
import { Shape } from "react-konva";

const Triangle = ({ shapeProps, isSelected, onSelect, onChange }) => {
  const shapeRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <Shape
      sceneFunc={(context, shape) => {
        context.beginPath();
        // Startpunkt des Dreiecks (erste Ecke)
        context.moveTo(shapeProps.x, shapeProps.y - shapeProps.height / 2);
        // Zweite Ecke: rechts unten vom Startpunkt
        context.lineTo(
          shapeProps.x + shapeProps.width / 2,
          shapeProps.y + shapeProps.height / 2
        );
        // Dritte Ecke: links unten vom Startpunkt
        context.lineTo(
          shapeProps.x - shapeProps.width / 2,
          shapeProps.y + shapeProps.height / 2
        );
        // Zurück zum Startpunkt
        context.closePath();
        // Zeichne das Dreieck
        context.fillStrokeShape(shape);
      }}
      onClick={onSelect}
      onTap={onSelect}
      {...shapeProps}
      draggable
      onDragEnd={(e) => {
        console.log("Before change:", shapeProps.x, shapeProps.y);
        console.log("After change:", e.target.x(), e.target.y());

        if (typeof onChange === "function") {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        } else {
          console.error("onChange is not a function");
        }
      }}
      onTransformEnd={(e) => {
        const node = e.target;
        onChange({
          ...shapeProps,
          x: node.x(),
          y: node.y(),
        });
      }}
      fill="#00D2FF"
      stroke="black"
      strokeWidth={4}
    />
  );
};

export default Triangle;
