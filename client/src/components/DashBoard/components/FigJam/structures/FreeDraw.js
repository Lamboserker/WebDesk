import React, {  useRef } from "react";
import {  Layer, Line, Text } from "react-konva";

const FreeDraw = ({ tool, lines, setLines }) => {





  return (
    <Layer>
      <Text text="Just start drawing" x={5} y={30} />
      {lines.map((line, i) => (
        <Line
          key={i}
          points={line.points}
          stroke="#df4b26"
          strokeWidth={5}
          tension={0.5}
          lineCap="round"
          lineJoin="round"
          globalCompositeOperation={
            line.tool === "eraser" ? "destination-out" : "source-over"
          }
        />
      ))}
    </Layer>
  );
};

export default FreeDraw;
