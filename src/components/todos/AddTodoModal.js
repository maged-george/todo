import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTheme } from "../../contexts/ThemeContext";
import { useTodos } from "../../contexts/TodoContext";
import CustomInput from "../common/CustomInput";
import CustomButton from "../common/CustomButton";
import { X, Calendar, Bell, Flag, Plus, Save } from "lucide-react-native";

const AddTodoModal = ({ visible, onClose, todo = null }) => {
  const { theme } = useTheme();
  const { addTodo, updateTodo, categories } = useTodos();
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showReminderPicker, setShowReminderPicker] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState("date");

  const isEdit = !!todo;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "personal",
    priority: "medium",
    dueDate: null,
    reminder: null,
    tags: [],
  });

  const [errors, setErrors] = useState({});

  // Initialize form data when todo prop changes
  useEffect(() => {
    if (todo) {
      setFormData({
        title: todo.title || "",
        description: todo.description || "",
        category: todo.category || "personal",
        priority: todo.priority || "medium",
        dueDate: todo.dueDate ? new Date(todo.dueDate) : null,
        reminder: todo.reminder ? new Date(todo.reminder) : null,
        tags: todo.tags || [],
      });
    } else {
      resetForm();
    }
  }, [todo]);

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
        reminder: formData.reminder?.toISOString(),
      };

      let result;
      if (isEdit) {
        result = await updateTodo(todo.id, todoData);
      } else {
        result = await addTodo(todoData);
      }

      if (result.success) {
        onClose();
        resetForm();
      } else {
        Alert.alert("Error", result.error);
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "personal",
      priority: "medium",
      dueDate: null,
      reminder: null,
      tags: [],
    });
    setErrors({});
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData({ ...formData, dueDate: selectedDate });
    }
  };

  const handleReminderChange = (event, selectedDate) => {
    setShowReminderPicker(false);
    if (selectedDate) {
      setFormData({ ...formData, reminder: selectedDate });
    }
  };

  const formatDate = (date) => {
    if (!date) return "Select date";
    return date.toLocaleDateString();
  };

  const formatDateTime = (date) => {
    if (!date) return "Select reminder";
    return date.toLocaleString();
  };

  const priorityOptions = [
    { value: "low", label: "Low", color: theme.success },
    { value: "medium", label: "Medium", color: theme.warning },
    { value: "high", label: "High", color: theme.danger },
  ];

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <X size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            {isEdit ? "Edit Todo" : "Add New Todo"}
          </Text>
          <View style={styles.headerSpace} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Basic Information */}
          <View style={styles.section}>
            <CustomInput
              label="Title *"
              placeholder="What needs to be done?"
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
              error={errors.title}
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

          {/* Date & Time */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Due Date & Reminder
            </Text>

            <TouchableOpacity
              style={[
                styles.dateButton,
                { backgroundColor: theme.card, borderColor: theme.border },
              ]}
              onPress={() => {
                setDatePickerMode("date");
                setShowDatePicker(true);
              }}
            >
              <Calendar size={20} color={theme.primary} />
              <Text
                style={[
                  styles.dateButtonText,
                  {
                    color: formData.dueDate ? theme.text : theme.textSecondary,
                  },
                ]}
              >
                {formatDate(formData.dueDate)}
              </Text>
              {formData.dueDate && (
                <TouchableOpacity
                  onPress={() => setFormData({ ...formData, dueDate: null })}
                  style={styles.clearButton}
                >
                  <X size={16} color={theme.textSecondary} />
                </TouchableOpacity>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.dateButton,
                { backgroundColor: theme.card, borderColor: theme.border },
              ]}
              onPress={() => {
                setDatePickerMode("datetime");
                setShowReminderPicker(true);
              }}
            >
              <Bell size={20} color={theme.primary} />
              <Text
                style={[
                  styles.dateButtonText,
                  {
                    color: formData.reminder ? theme.text : theme.textSecondary,
                  },
                ]}
              >
                {formatDateTime(formData.reminder)}
              </Text>
              {formData.reminder && (
                <TouchableOpacity
                  onPress={() => setFormData({ ...formData, reminder: null })}
                  style={styles.clearButton}
                >
                  <X size={16} color={theme.textSecondary} />
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <CustomButton
              title="Cancel"
              variant="outline"
              onPress={handleClose}
              style={styles.cancelButton}
            />
            <CustomButton
              title={isEdit ? "Update" : "Add Todo"}
              onPress={handleSubmit}
              loading={loading}
              icon={isEdit ? Save : Plus}
              style={styles.submitButton}
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
          />
        )}

        {showReminderPicker && (
          <DateTimePicker
            value={formData.reminder || new Date()}
            mode="datetime"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleReminderChange}
            minimumDate={new Date()}
          />
        )}
      </View>
    </Modal>
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
  closeButton: {
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
  },
  dateButtonText: {
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
  clearButton: {
    padding: 4,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 20,
    paddingBottom: 40,
  },
  cancelButton: {
    flex: 1,
  },
  submitButton: {
    flex: 2,
  },
});

export default AddTodoModal;
