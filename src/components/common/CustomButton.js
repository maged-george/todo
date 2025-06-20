import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

const CustomButton = ({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  icon: Icon,
  style,
  textStyle,
}) => {
  const { theme } = useTheme();

  const getButtonStyle = () => {
    const baseStyle = {
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
    };

    const sizeStyles = {
      small: { paddingVertical: 8, paddingHorizontal: 16 },
      medium: { paddingVertical: 12, paddingHorizontal: 20 },
      large: { paddingVertical: 16, paddingHorizontal: 24 },
    };

    const variantStyles = {
      primary: {
        backgroundColor: disabled ? theme.border : theme.primary,
      },
      secondary: {
        backgroundColor: disabled ? theme.border : theme.secondary,
      },
      outline: {
        backgroundColor: "transparent",
        borderWidth: 1.5,
        borderColor: disabled ? theme.border : theme.primary,
      },
      ghost: {
        backgroundColor: "transparent",
      },
      success: {
        backgroundColor: disabled ? theme.border : theme.success,
      },
      danger: {
        backgroundColor: disabled ? theme.border : theme.danger,
      },
    };

    return [
      baseStyle,
      sizeStyles[size],
      variantStyles[variant],
      disabled && { opacity: 0.6 },
      style,
    ];
  };

  const getTextStyle = () => {
    const baseTextStyle = {
      fontWeight: "600",
      textAlign: "center",
    };

    const sizeTextStyles = {
      small: { fontSize: 14 },
      medium: { fontSize: 16 },
      large: { fontSize: 18 },
    };

    const variantTextStyles = {
      primary: { color: "#ffffff" },
      secondary: { color: "#ffffff" },
      outline: { color: disabled ? theme.textSecondary : theme.primary },
      ghost: { color: disabled ? theme.textSecondary : theme.primary },
      success: { color: "#ffffff" },
      danger: { color: "#ffffff" },
    };

    return [
      baseTextStyle,
      sizeTextStyles[size],
      variantTextStyles[variant],
      textStyle,
    ];
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={
            variant === "outline" || variant === "ghost"
              ? theme.primary
              : "#ffffff"
          }
          size="small"
        />
      ) : (
        <View style={styles.content}>
          {Icon && (
            <Icon
              size={size === "small" ? 16 : size === "large" ? 20 : 18}
              color={
                variant === "outline" || variant === "ghost"
                  ? theme.primary
                  : "#ffffff"
              }
              style={styles.icon}
            />
          )}
          <Text style={getTextStyle()}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginRight: 8,
  },
});

export default CustomButton;
