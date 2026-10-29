# To-Do App

A task management mobile app built with **React Native** and **Expo**. Users sign in, add tasks by category, mark them as done, track their progress, and get reminders.

## Features

- Sign up and sign in, with the user saved on the device
- Add, edit, complete, and delete tasks
- Categories: Personal, Work, Shopping, and Health
- Filter tasks: all, pending, completed, and due today
- Statistics screen to track progress
- Light and dark theme, remembered between sessions
- Task reminders with Expo Notifications
- Profile screen
- Data stored locally with AsyncStorage
- State managed with React Context (auth, tasks, theme)
- Stack and bottom-tab navigation with React Navigation

## Tech stack

React Native 0.79 · Expo 53 · React 19 · React Navigation · React Context · AsyncStorage · Expo Notifications · Lucide icons

## Run it locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the app:

   ```bash
   npx expo start
   ```

3. Scan the QR code with the **Expo Go** app on your phone, or press `a` for an Android emulator or `i` for the iOS simulator.

## Project structure

```
src/
├── components/   # Reusable UI (buttons, inputs, task items, cards)
├── contexts/     # AuthContext, TodoContext, ThemeContext
├── navigation/   # Stack + bottom-tab navigator
└── screens/      # Login, Home, Add task, Statistics, Profile
```
