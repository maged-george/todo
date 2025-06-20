import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTheme } from "../../contexts/ThemeContext";
import { useTodos } from "../../contexts/TodoContext";
import CustomInput from "../../components/common/CustomInput";
import CustomButton from "../../components/common/CustomButton";
import { ArrowLeft, Calendar, Flag, Save } from "lucide-react-native";

const AddTodoScreen = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();
  const { addTodo, categories } = useTodos();
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "personal",
    priority: "medium",
    dueDate: null,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Auto-focus on mount or reset form when screen is focused
    const unsubscribe = navigation.addListener("focus", () => {
      setFormData({
        title: "",
        description: "",
        category: "personal",
        priority: "medium",
        dueDate: null,
      });
      setErrors({});
    });

    return unsubscribe;
  }, [navigation]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const todoData = {
        ...formData,
        dueDate: formData.dueDate?.toISOString(),
      };

      const result = await addTodo(todoData);

      if (result.success) {
        // Navigate back to Home tab
        navigation.navigate("Home");

        // Show detailed success message
        let successMessage = "Todo created successfully!";
        if (formData.dueDate) {
          successMessage += `\nDue: ${formatDate(formData.dueDate)}`;
        }

        Alert.alert("Success", successMessage);
      } else {
        Alert.alert("Error", result.error);
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate && event.type !== "dismissed") {
      setFormData({ ...formData, dueDate: selectedDate });
    }
  };

  const formatDate = (date) => {
    if (!date) return "Select date";
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year:
          date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
      });
    }
  };

  const priorityOptions = [
    { value: "low", label: "Low", color: theme.success },
    { value: "medium", label: "Medium", color: theme.warning },
    { value: "high", label: "High", color: theme.danger },
  ];

  const handleBack = () => {
    navigation.navigate("Home");
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowLeft size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Add New Todo
        </Text>
        <View style={styles.headerSpace} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Basic Information */}
        <View style={styles.section}>
          <CustomInput
            label="Title *"
            placeholder="What needs to be done?"
            value={formData.title}
            onChangeText={(text) => setFormData({ ...formData, title: text })}
            error={errors.title}
            autoFocus
          />

          <CustomInput
            label="Description"
            placeholder="Add more details..."
            value={formData.description}
            onChangeText={(text) =>
              setFormData({ ...formData, description: text })
            }
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Category Selection */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Category
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryContainer}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryOption,
                  {
                    backgroundColor:
                      formData.category === category.id
                        ? category.color
                        : theme.card,
                    borderColor: category.color,
                  },
                ]}
                onPress={() =>
                  setFormData({ ...formData, category: category.id })
                }
              >
                <Text
                  style={[
                    styles.categoryText,
                    {
                      color:
                        formData.category === category.id
                          ? "#ffffff"
                          : theme.text,
                    },
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Priority Selection */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Priority
          </Text>
          <View style={styles.priorityContainer}>
            {priorityOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.priorityOption,
                  {
                    backgroundColor:
                      formData.priority === option.value
                        ? option.color
                        : theme.card,
                    borderColor: option.color,
                  },
                ]}
                onPress={() =>
                  setFormData({ ...formData, priority: option.value })
                }
              >
                <Flag
                  size={16}
                  color={
                    formData.priority === option.value
                      ? "#ffffff"
                      : option.color
                  }
                />
                <Text
                  style={[
                    styles.priorityText,
                    {
                      color:
                        formData.priority === option.value
                          ? "#ffffff"
                          : theme.text,
                    },
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Due Date */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Due Date
          </Text>
          <Text
            style={[styles.sectionDescription, { color: theme.textSecondary }]}
          >
            Set when this task should be completed
          </Text>

          <TouchableOpacity
            style={[
              styles.dateButton,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
            onPress={() => setShowDatePicker(true)}
          >
            <Calendar size={20} color={theme.primary} />
            <Text
              style={[
                styles.dateButtonText,
                { color: formData.dueDate ? theme.text : theme.textSecondary },
              ]}
            >
              {formatDate(formData.dueDate)}
            </Text>
            {formData.dueDate && (
              <TouchableOpacity
                onPress={() => setFormData({ ...formData, dueDate: null })}
                style={[
                  styles.clearButton,
                  {
                    backgroundColor: isDarkMode
                      ? "rgba(255, 255, 255, 0.1)"
                      : "rgba(0, 0, 0, 0.05)",
                  },
                ]}
              >
                <Text style={[styles.clearButtonText, { color: theme.danger }]}>
                  Clear
                </Text>
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <CustomButton
            title="Save Todo"
            onPress={handleSubmit}
            loading={loading}
            icon={Save}
          />
        </View>
      </ScrollView>

      {/* Date Pickers */}
      {showDatePicker && (
        <DateTimePicker
          value={formData.dueDate || new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
          minimumDate={new Date()}
          themeVariant={isDarkMode ? "dark" : "light"}
          textColor={theme.text}
          accentColor={theme.primary}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    paddingTop: 50,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  headerSpace: {
    width: 32,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  categoryContainer: {
    paddingRight: 20,
  },
  categoryOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "500",
  },
  priorityContainer: {
    flexDirection: "row",
    gap: 12,
  },
  priorityOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  priorityText: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 6,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    minHeight: 52,
  },
  dateButtonText: {
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
    fontWeight: "500",
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  actions: {
    paddingVertical: 20,
    paddingBottom: 40,
  },
  errorText: {
    fontSize: 14,
    marginTop: 6,
    marginLeft: 4,
  },
  sectionDescription: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
});

export default AddTodoScreen;
