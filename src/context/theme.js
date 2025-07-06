import { createContext } from 'react';

export const ThemeContext = createContext();

export const darkTheme = {
  primary: '#64ffda',
  background: '#0a192f',
  backgroundSecondary: '#112240',
  text: '#8892b0',
  textHighlight: '#ccd6f6',
  cardBackground: 'rgba(255, 255, 255, 0.03)',
  cardBorder: 'rgba(255, 255, 255, 0.1)',
  navBackground: 'rgba(10, 25, 47, 0.95)',
};

export const lightTheme = {
  primary: '#006C51',
  background: '#FFFBFF',
  backgroundSecondary: '#F4F0F4',
  text: '#1A1C1E',
  textHighlight: '#006C51',
  cardBackground: 'rgba(255, 251, 255, 0.95)',
  cardBorder: 'rgba(0, 108, 81, 0.12)',
  navBackground: 'rgba(255, 251, 255, 0.98)',
};
