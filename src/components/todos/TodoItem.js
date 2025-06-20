import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { useTodos } from "../../contexts/TodoContext";
import {
  CheckCircle,
  Circle,
  Calendar,
  AlertCircle,
  Edit3,
  Trash2,
  Flag,
} from "lucide-react-native";

const TodoItem = ({ todo, onEdit }) => {
  const { theme } = useTheme();
  const { categories, toggleTodo, deleteTodo } = useTodos();

  const category = categories.find((cat) => cat.id === todo.category);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return theme.danger;
      case "medium":
        return theme.warning;
      case "low":
        return theme.success;
      default:
        return theme.textSecondary;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString();
    }
  };

  const isOverdue = () => {
    if (!todo.dueDate || todo.completed) return false;
    return new Date(todo.dueDate) < new Date();
  };

  const handleToggle = async () => {
    await toggleTodo(todo.id);
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(todo);
    }
  };

  const handleDelete = () => {
    Alert.alert("Delete Todo", "Are you sure you want to delete this todo?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteTodo(todo.id);
        },
      },
    ]);
  };

  const cardStyle = [
    styles.container,
    {
      backgroundColor: theme.card,
      borderColor: category?.color || theme.border,
      borderLeftWidth: 4,
    },
    todo.completed && styles.completedCard,
  ];

  return (
    <View style={cardStyle}>
      <TouchableOpacity
        style={styles.mainContent}
        onPress={handleToggle}
        activeOpacity={0.7}
      >
        <View style={styles.leftContent}>
          <TouchableOpacity style={styles.checkbox} onPress={handleToggle}>
            {todo.completed ? (
              <CheckCircle size={24} color={theme.success} />
            ) : (
              <Circle size={24} color={theme.textSecondary} />
            )}
          </TouchableOpacity>

          <View style={styles.textContent}>
            <Text
              style={[
                styles.title,
                {
                  color: todo.completed ? theme.textSecondary : theme.text,
                  textDecorationLine: todo.completed ? "line-through" : "none",
                },
              ]}
              numberOfLines={2}
            >
              {todo.title}
            </Text>

            {todo.description && (
              <Text
                style={[styles.description, { color: theme.textSecondary }]}
                numberOfLines={1}
              >
                {todo.description}
              </Text>
            )}

            <View style={styles.metadata}>
              {category && (
                <View style={styles.categoryTag}>
                  <View
                    style={[
                      styles.categoryDot,
                      { backgroundColor: category.color },
                    ]}
                  />
                  <Text
                    style={[
                      styles.categoryText,
                      { color: theme.textSecondary },
                    ]}
                  >
                    {category.name}
                  </Text>
                </View>
              )}

              {todo.dueDate && (
                <View style={styles.dueDateContainer}>
                  <Calendar
                    size={12}
                    color={isOverdue() ? theme.danger : theme.textSecondary}
                  />
                  <Text
                    style={[
                      styles.dueDate,
                      {
                        color: isOverdue() ? theme.danger : theme.textSecondary,
                      },
                    ]}
                  >
                    {formatDate(todo.dueDate)}
                  </Text>
                </View>
              )}

              <View style={styles.priorityContainer}>
                <Flag size={12} color={getPriorityColor(todo.priority)} />
                <Text
                  style={[
                    styles.priority,
                    { color: getPriorityColor(todo.priority) },
                  ]}
                >
                  {todo.priority}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: theme.primary + "20" },
          ]}
          onPress={handleEdit}
        >
          <Edit3 size={16} color={theme.primary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: theme.danger + "20" },
          ]}
          onPress={handleDelete}
        >
          <Trash2 size={16} color={theme.danger} />
        </TouchableOpacity>
      </View>

      {isOverdue() && (
        <View style={styles.overdueIndicator}>
          <AlertCircle size={16} color={theme.danger} />
          <Text style={[styles.overdueText, { color: theme.danger }]}>
            Overdue
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    marginHorizontal: 2,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  completedCard: {
    opacity: 0.7,
  },
  mainContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  leftContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  checkbox: {
    marginRight: 12,
    marginTop: 2,
  },
  textContent: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    lineHeight: 22,
  },
  description: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 18,
  },
  metadata: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
  },
  categoryTag: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "500",
  },
  dueDateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dueDate: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: "500",
  },
  priorityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  priority: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: "500",
    textTransform: "capitalize",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  overdueIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#ff000020",
  },
  overdueText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
});

export default TodoItem;
