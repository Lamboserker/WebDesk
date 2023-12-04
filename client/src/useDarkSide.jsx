// useDarkSide.js
import { useState, useEffect } from 'react';

const useDarkSide = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  return [theme, setTheme];
};

export default useDarkSide;
