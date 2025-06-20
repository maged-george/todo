import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "../../contexts/ThemeContext";
import { useTodos } from "../../contexts/TodoContext";
import { useAuth } from "../../contexts/AuthContext";
import TodoItem from "../../components/todos/TodoItem";
import AddTodoModal from "../../components/todos/AddTodoModal";
import {
  Plus,
  BarChart3,
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-react-native";

const HomeScreen = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();
  const { user } = useAuth();
  const { todos, isLoading, getFilteredTodos, getStatistics } = useTodos();

  const [filter, setFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const statistics = getStatistics();
  const filteredTodos = getFilteredTodos(filter);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh - in real app, this would reload from storage
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleEditTodo = (todo) => {
    setEditingTodo(todo);
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingTodo(null);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const filterOptions = [
    { key: "all", label: "All", icon: BarChart3 },
    { key: "pending", label: "Pending", icon: Clock },
    { key: "completed", label: "Completed", icon: CheckCircle },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <View style={styles.headerContent}>
          <View>
            <Text style={[styles.greeting, { color: theme.textSecondary }]}>
              {getGreeting()}, {user?.name?.split(" ")[0] || "User"}!
            </Text>
            <Text style={[styles.headerTitle, { color: theme.text }]}>
              Your Tasks
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: theme.primary }]}
            onPress={() => setShowAddModal(true)}
          >
            <Plus size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.primary]}
            tintColor={theme.primary}
          />
        }
      >
        {/* Statistics */}
        <View style={[styles.statsContainer, { backgroundColor: theme.card }]}>
          <Text style={[styles.statsTitle, { color: theme.text }]}>
            Overview
          </Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.text }]}>
                {statistics.total}
              </Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                Total
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.success }]}>
                {statistics.completed}
              </Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                Completed
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.warning }]}>
                {statistics.pending}
              </Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                Pending
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.primary }]}>
                {statistics.completionRate}%
              </Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                Complete
              </Text>
            </View>
          </View>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterContent}
          >
            {filterOptions.map((option) => {
              const isActive = filter === option.key;
              const Icon = option.icon;

              return (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.filterTab,
                    {
                      backgroundColor: isActive ? theme.primary : theme.card,
                      borderColor: theme.border,
                    },
                  ]}
                  onPress={() => setFilter(option.key)}
                >
                  <Icon
                    size={16}
                    color={isActive ? "#ffffff" : theme.textSecondary}
                  />
                  <Text
                    style={[
                      styles.filterTabText,
                      {
                        color: isActive ? "#ffffff" : theme.textSecondary,
                      },
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Todo List */}
        <View style={styles.todoList}>
          {filteredTodos.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyTitle, { color: theme.text }]}>
                {filter === "all" ? "No todos yet!" : `No ${filter} todos`}
              </Text>
              <Text
                style={[styles.emptySubtitle, { color: theme.textSecondary }]}
              >
                {filter === "all"
                  ? "Tap the + button to create your first todo"
                  : `You don't have any ${filter} todos right now`}
              </Text>
            </View>
          ) : (
            filteredTodos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} onEdit={handleEditTodo} />
            ))
          )}
        </View>
      </ScrollView>

      {/* Add/Edit Todo Modal */}
      <AddTodoModal
        visible={showAddModal}
        onClose={handleCloseModal}
        todo={editingTodo}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    fontSize: 16,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statsContainer: {
    marginVertical: 20,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  filterContainer: {
    marginVertical: 20,
  },
  filterContent: {
    paddingRight: 20,
  },
  filterTab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  todoList: {
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 40,
  },
});

export default HomeScreen;
