import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { Plus, Calendar, Clock, Flag } from "lucide-react-native";

const QuickActions = ({
  onAddTodo,
  onViewToday,
  onViewPending,
  onViewHigh,
}) => {
  const { theme } = useTheme();

  const ActionButton = ({
    icon: Icon,
    title,
    onPress,
    color = theme.primary,
  }) => (
    <TouchableOpacity
      style={[styles.actionButton, { backgroundColor: theme.card }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: color + "20" }]}>
        <Icon size={20} color={color} />
      </View>
      <Text style={[styles.actionText, { color: theme.text }]}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.text }]}>Quick Actions</Text>
      <View style={styles.actionsGrid}>
        <ActionButton
          icon={Plus}
          title="Add Todo"
          onPress={onAddTodo}
          color={theme.primary}
        />
        <ActionButton
          icon={Calendar}
          title="Today"
          onPress={onViewToday}
          color={theme.success}
        />
        <ActionButton
          icon={Clock}
          title="Pending"
          onPress={onViewPending}
          color={theme.warning}
        />
        <ActionButton
          icon={Flag}
          title="High Priority"
          onPress={onViewHigh}
          color={theme.danger}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    minWidth: "45%",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
});

export default QuickActions;
