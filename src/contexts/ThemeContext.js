import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ThemeContext = createContext();

export const themes = {
  light: {
    background: "#ffffff",
    surface: "#f8f9fa",
    card: "#ffffff",
    text: "#000000",
    textSecondary: "#6c757d",
    primary: "#007bff",
    secondary: "#6c757d",
    success: "#28a745",
    warning: "#ffc107",
    danger: "#dc3545",
    border: "#dee2e6",
    shadow: "#000000",
    statusBarStyle: "dark-content",
    tabBarBackground: "#ffffff",
    tabBarActive: "#007bff",
    tabBarInactive: "#6c757d",
  },
  dark: {
    background: "#000000",
    surface: "#1a1a1a",
    card: "#2d2d2d",
    text: "#ffffff",
    textSecondary: "#a0a0a0",
    primary: "#0d6efd",
    secondary: "#6c757d",
    success: "#198754",
    warning: "#fd7e14",
    danger: "#dc3545",
    border: "#495057",
    shadow: "#ffffff",
    statusBarStyle: "light-content",
    tabBarBackground: "#1a1a1a",
    tabBarActive: "#0d6efd",
    tabBarInactive: "#a0a0a0",
  },
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [theme, setTheme] = useState(themes.light);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem("theme");
      if (savedTheme) {
        const darkMode = savedTheme === "dark";
        setIsDarkMode(darkMode);
        setTheme(darkMode ? themes.dark : themes.light);
      }
    } catch (error) {
      console.error("Error loading theme:", error);
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = !isDarkMode;
      setIsDarkMode(newTheme);
      setTheme(newTheme ? themes.dark : themes.light);
      await AsyncStorage.setItem("theme", newTheme ? "dark" : "light");
    } catch (error) {
      console.error("Error saving theme:", error);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDarkMode,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
