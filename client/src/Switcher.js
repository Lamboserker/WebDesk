import React, { useState, useEffect } from "react";
import useDarkSide from "./useDarkSide";
import DarkModeToggle from "react-dark-mode-toggle";

export default function Switcher() {
  const [theme, setTheme] = useDarkSide();
  const [darkSide, setDarkSide] = useState(theme === "dark");

  useEffect(() => {
    setTheme(darkSide ? "dark" : "light");
  }, [darkSide, setTheme]);

  const toggleDarkMode = (checked) => {
    setDarkSide(checked);
  };

  return (
    <>
      <div>
        <DarkModeToggle
          checked={darkSide}
          onChange={toggleDarkMode}
          size={80}
        />
      </div>
    </>
  );
}
