import "react-native-get-random-values";
import React, { useEffect } from "react";
import { LogBox, Platform } from "react-native";
import * as Notifications from "expo-notifications";
import "react-native-gesture-handler";

// Providers
import { ThemeProvider } from "./src/contexts/ThemeContext";
import { AuthProvider } from "./src/contexts/AuthContext";
import { TodoProvider } from "./src/contexts/TodoContext";

// Navigation
import AppNavigator from "./src/navigation/AppNavigator";

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Ignore specific warnings
LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
  "ViewPropTypes will be removed",
]);

export default function App() {
  useEffect(() => {
    // Request notification permissions
    const requestPermissions = async () => {
      try {
        if (Platform.OS !== "web") {
          const { status } = await Notifications.requestPermissionsAsync();
          if (status !== "granted") {
            console.log(
              "Notification permissions not granted - reminders will work without push notifications"
            );
          } else {
            console.log("Notification permissions granted");
          }
        }
      } catch (error) {
        console.log("Notifications not available in current environment");
      }
    };

    requestPermissions();
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <TodoProvider>
          <AppNavigator />
        </TodoProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
