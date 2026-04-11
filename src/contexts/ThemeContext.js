import React, { createContext, useContext } from 'react';
import theme from '../config/theme';

const ThemeContext = createContext({ currentTheme: theme });

export const ThemeProvider = ({ children }) => (
  <ThemeContext.Provider value={{ currentTheme: theme }}>
    {children}
  </ThemeContext.Provider>
);

export const useTheme = () => useContext(ThemeContext);