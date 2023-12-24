import React, { useEffect, useRef, useState } from "react";
import { Text, Transformer } from "react-konva";

const EditableText = ({ shapeProps, isSelected, onSelect, onChange }) => {
  const textRef = useRef(null);
  const transformerRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(shapeProps.text);
  const [position, setPosition] = useState({ x: 100, y: 100 });

  useEffect(() => {
    if (isSelected) {
      // attach transformer
      transformerRef.current.nodes([textRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  useEffect(() => {
    if (isEditing) {
      // Create and style your textarea here
      const textarea = document.createElement("textarea");
      textarea.value = text;
      // ... (additional styling for textarea to match the Konva Text)

      const handleOutsideClick = (e) => {
        if (e.target !== textarea) {
          setText(textarea.value);
          setIsEditing(false);
          onChange({ ...shapeProps, text: textarea.value }); // Update the text of the shape
          document.body.removeChild(textarea);
        }
      };

      textarea.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          setText(textarea.value);
          setIsEditing(false);
          onChange({ ...shapeProps, text: textarea.value });
          document.body.removeChild(textarea);
        } else if (e.key === "Escape") {
          setIsEditing(false);
          document.body.removeChild(textarea);
        }
      });

      document.body.appendChild(textarea);
      textarea.focus();

      setTimeout(() => {
        window.addEventListener("click", handleOutsideClick);
      });

      return () => {
        window.removeEventListener("click", handleOutsideClick);
      };
    }
  }, [isEditing, onChange, shapeProps]);

  const handleDragEnd = (e) => {
    // update the state with the new x and y
    setPosition({
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  const handleDblClick = () => {
    setIsEditing(true);
  };

  return (
    <>
      <Text
        {...shapeProps}
        ref={textRef}
        text={text}
        onClick={onSelect}
        onDblClick={handleDblClick}
        x={position.x}
        y={position.y}
        draggable
        onDragEnd={handleDragEnd}
      />
      {isSelected && (
        <Transformer
          ref={transformerRef}
          boundBoxFunc={(oldBox, newBox) => {
            // Limit the size of the text box
            newBox.width = Math.max(30, newBox.width);
            return newBox;
          }}
          enabledAnchors={["middle-left", "middle-right"]}
        />
      )}
    </>
  );
};

export default EditableText;
