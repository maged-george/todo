import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuidv4 } from "uuid";
import * as Notifications from "expo-notifications";

// Fallback UUID generation if crypto is not available
const generateId = () => {
  try {
    return uuidv4();
  } catch (error) {
    // Fallback UUID generation
    return (
      "xxxx-xxxx-4xxx-yxxx".replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }) +
      "-" +
      Date.now()
    );
  }
};

const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const [categories, setCategories] = useState([
    { id: "personal", name: "Personal", color: "#007bff", icon: "user" },
    { id: "work", name: "Work", color: "#28a745", icon: "briefcase" },
    {
      id: "shopping",
      name: "Shopping",
      color: "#ffc107",
      icon: "shopping-cart",
    },
    { id: "health", name: "Health", color: "#dc3545", icon: "heart" },
  ]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTodos();
    loadCategories();
  }, []);

  const loadTodos = async () => {
    try {
      const todosData = await AsyncStorage.getItem("todos");
      if (todosData) {
        setTodos(JSON.parse(todosData));
      }
    } catch (error) {
      console.error("Error loading todos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const categoriesData = await AsyncStorage.getItem("categories");
      if (categoriesData) {
        setCategories(JSON.parse(categoriesData));
      }
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const saveTodos = async (todosData) => {
    try {
      await AsyncStorage.setItem("todos", JSON.stringify(todosData));
    } catch (error) {
      console.error("Error saving todos:", error);
    }
  };

  const saveCategories = async (categoriesData) => {
    try {
      await AsyncStorage.setItem("categories", JSON.stringify(categoriesData));
    } catch (error) {
      console.error("Error saving categories:", error);
    }
  };

  const addTodo = async (todoData) => {
    try {
      const newTodo = {
        id: generateId(),
        title: todoData.title,
        description: todoData.description || "",
        completed: false,
        priority: todoData.priority || "medium",
        category: todoData.category || "personal",
        dueDate: todoData.dueDate || null,
        reminder: todoData.reminder || null,
        tags: todoData.tags || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updatedTodos = [...todos, newTodo];
      setTodos(updatedTodos);
      await saveTodos(updatedTodos);

      // Schedule notification if reminder is set
      if (newTodo.reminder) {
        await scheduleNotification(newTodo);
      }

      return { success: true, todo: newTodo };
    } catch (error) {
      console.error("Error adding todo:", error);
      return { success: false, error: "Failed to add todo" };
    }
  };

  const updateTodo = async (id, updates) => {
    try {
      const updatedTodos = todos.map((todo) =>
        todo.id === id
          ? { ...todo, ...updates, updatedAt: new Date().toISOString() }
          : todo
      );
      setTodos(updatedTodos);
      await saveTodos(updatedTodos);

      // Update notification if reminder changed
      const updatedTodo = updatedTodos.find((todo) => todo.id === id);
      if (updatedTodo && updatedTodo.reminder) {
        await scheduleNotification(updatedTodo);
      }

      return { success: true };
    } catch (error) {
      console.error("Error updating todo:", error);
      return { success: false, error: "Failed to update todo" };
    }
  };

  const deleteTodo = async (id) => {
    try {
      const updatedTodos = todos.filter((todo) => todo.id !== id);
      setTodos(updatedTodos);
      await saveTodos(updatedTodos);

      // Cancel notification
      await cancelNotification(id);

      return { success: true };
    } catch (error) {
      console.error("Error deleting todo:", error);
      return { success: false, error: "Failed to delete todo" };
    }
  };

  const toggleTodo = async (id) => {
    try {
      const todo = todos.find((t) => t.id === id);
      if (todo) {
        await updateTodo(id, { completed: !todo.completed });
      }
    } catch (error) {
      console.error("Error toggling todo:", error);
    }
  };

  const addCategory = async (categoryData) => {
    try {
      const newCategory = {
        id: generateId(),
        name: categoryData.name,
        color: categoryData.color,
        icon: categoryData.icon,
      };

      const updatedCategories = [...categories, newCategory];
      setCategories(updatedCategories);
      await saveCategories(updatedCategories);

      return { success: true, category: newCategory };
    } catch (error) {
      console.error("Error adding category:", error);
      return { success: false, error: "Failed to add category" };
    }
  };

  const scheduleNotification = async (todo) => {
    try {
      if (todo.reminder) {
        const reminderDate = new Date(todo.reminder);
        if (reminderDate > new Date()) {
          // Check if we're in Expo Go (which doesn't support notifications fully)
          const isExpoGo = __DEV__ && !Notifications.scheduleNotificationAsync;

          if (!isExpoGo) {
            await Notifications.scheduleNotificationAsync({
              content: {
                title: "Todo Reminder",
                body: todo.title,
                data: { todoId: todo.id },
              },
              trigger: reminderDate,
              identifier: todo.id,
            });
          } else {
            console.log("Notification scheduled (Expo Go - simulation):", {
              title: "Todo Reminder",
              body: todo.title,
              time: reminderDate.toLocaleString(),
            });
          }
        }
      }
    } catch (error) {
      console.log(
        "Notification not available in current environment:",
        error.message
      );
    }
  };

  const cancelNotification = async (todoId) => {
    try {
      const isExpoGo =
        __DEV__ && !Notifications.cancelScheduledNotificationAsync;

      if (!isExpoGo) {
        await Notifications.cancelScheduledNotificationAsync(todoId);
      } else {
        console.log("Notification cancelled (Expo Go - simulation):", todoId);
      }
    } catch (error) {
      console.log("Notification cancellation not available:", error.message);
    }
  };

  const getFilteredTodos = (filter) => {
    switch (filter) {
      case "completed":
        return todos.filter((todo) => todo.completed);
      case "pending":
        return todos.filter((todo) => !todo.completed);
      case "today":
        const today = new Date().toDateString();
        return todos.filter(
          (todo) =>
            todo.dueDate && new Date(todo.dueDate).toDateString() === today
        );
      default:
        return todos;
    }
  };

  const getTodosByCategory = (categoryId) => {
    return todos.filter((todo) => todo.category === categoryId);
  };

  const getStatistics = () => {
    const total = todos.length;
    const completed = todos.filter((todo) => todo.completed).length;
    const pending = total - completed;

    return {
      total,
      completed,
      pending,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        categories,
        isLoading,
        addTodo,
        updateTodo,
        deleteTodo,
        toggleTodo,
        addCategory,
        getFilteredTodos,
        getTodosByCategory,
        getStatistics,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodos = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error("useTodos must be used within a TodoProvider");
  }
  return context;
};
