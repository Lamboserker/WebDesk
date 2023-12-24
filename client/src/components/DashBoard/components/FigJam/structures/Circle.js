import React from "react";
import { Circle } from "react-konva";

const CircleShape = ({ shapeProps, isSelected, onSelect, onChange }) => {
  const { x: validX, y: validY, radius: validRadius } = shapeProps;

  return (
    <Circle
      onClick={onSelect}
      onTap={onSelect}
      {...shapeProps}
      draggable
      onDragEnd={(e) => {
        onChange({
          ...shapeProps,
          x: e.target.x(),
          y: e.target.y(),
        });
      }}
      onTransformEnd={(e) => {
        const node = e.target;
        onChange({
          ...shapeProps,
          x: node.x(),
          y: node.y(),
          radius: Math.max(5, node.radius() * node.scaleX()),
        });
        // reset the scale to prevent shape distortion
        node.scaleX(1);
        node.scaleY(1);
      }}
    />
  );
};

export default CircleShape;
