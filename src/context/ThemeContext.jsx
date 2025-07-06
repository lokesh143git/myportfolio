import React, { useState, useEffect } from 'react';
import { ThemeContext, darkTheme, lightTheme } from './theme.js';

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => setIsDarkMode(e.matches);
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const theme = {
    isDarkMode,
    toggleTheme,
    colors: isDarkMode ? darkTheme : lightTheme
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};
