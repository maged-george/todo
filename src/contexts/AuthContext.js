import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuidv4 } from "uuid";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error("Error loading user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email, password, name) => {
    try {
      // Simulate API call
      const newUser = {
        id: uuidv4(),
        email,
        name,
        createdAt: new Date().toISOString(),
        avatar: `https://ui-avatars.com/api/?name=${name}&background=007bff&color=fff&size=100`,
      };

      await AsyncStorage.setItem("user", JSON.stringify(newUser));
      setUser(newUser);
      return { success: true };
    } catch (error) {
      console.error("Error signing up:", error);
      return { success: false, error: "Sign up failed" };
    }
  };

  const signIn = async (email, password) => {
    try {
      // Simulate API call
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        if (user.email === email) {
          setUser(user);
          return { success: true };
        }
      }
      return { success: false, error: "Invalid credentials" };
    } catch (error) {
      console.error("Error signing in:", error);
      return { success: false, error: "Sign in failed" };
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem("user");
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const updateProfile = async (updates) => {
    try {
      const updatedUser = { ...user, ...updates };
      await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      return { success: true };
    } catch (error) {
      console.error("Error updating profile:", error);
      return { success: false, error: "Profile update failed" };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signUp,
        signIn,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
