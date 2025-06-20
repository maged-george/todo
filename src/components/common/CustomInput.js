import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { Eye, EyeOff } from "lucide-react-native";

const CustomInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = "default",
  multiline = false,
  numberOfLines = 1,
  error,
  disabled = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  onRightIconPress,
  style,
  inputStyle,
  ...props
}) => {
  const { theme } = useTheme();
  const [isSecure, setIsSecure] = useState(secureTextEntry);
  const [isFocused, setIsFocused] = useState(false);

  const toggleSecureEntry = () => {
    setIsSecure(!isSecure);
  };

  const inputContainerStyle = [
    styles.inputContainer,
    {
      borderColor: error
        ? theme.danger
        : isFocused
        ? theme.primary
        : theme.border,
      backgroundColor: disabled ? theme.border : theme.card,
    },
    style,
  ];

  const textInputStyle = [
    styles.textInput,
    {
      color: theme.text,
      fontSize: 16,
    },
    multiline && { minHeight: numberOfLines * 20 },
    inputStyle,
  ];

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
      )}

      <View style={inputContainerStyle}>
        {LeftIcon && (
          <LeftIcon
            size={20}
            color={theme.textSecondary}
            style={styles.leftIcon}
          />
        )}

        <TextInput
          style={textInputStyle}
          placeholder={placeholder}
          placeholderTextColor={theme.textSecondary}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isSecure}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={!disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {secureTextEntry && (
          <TouchableOpacity onPress={toggleSecureEntry} style={styles.eyeIcon}>
            {isSecure ? (
              <EyeOff size={20} color={theme.textSecondary} />
            ) : (
              <Eye size={20} color={theme.textSecondary} />
            )}
          </TouchableOpacity>
        )}

        {RightIcon && !secureTextEntry && (
          <TouchableOpacity onPress={onRightIconPress} style={styles.rightIcon}>
            <RightIcon size={20} color={theme.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <Text style={[styles.error, { color: theme.danger }]}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    textAlignVertical: "top",
  },
  leftIcon: {
    marginRight: 12,
  },
  rightIcon: {
    marginLeft: 12,
  },
  eyeIcon: {
    marginLeft: 12,
    padding: 4,
  },
  error: {
    fontSize: 14,
    marginTop: 6,
    marginLeft: 4,
  },
});

export default CustomInput;
