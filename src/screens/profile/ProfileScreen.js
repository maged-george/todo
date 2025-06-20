import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { useTodos } from "../../contexts/TodoContext";
import CustomButton from "../../components/common/CustomButton";
import {
  User,
  Moon,
  Sun,
  BarChart3,
  Settings,
  LogOut,
  Mail,
  Calendar,
} from "lucide-react-native";

const ProfileScreen = () => {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const { getStatistics } = useTodos();

  const statistics = getStatistics();

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: signOut,
      },
    ]);
  };

  const ProfileSection = ({ title, children }) => (
    <View style={[styles.section, { backgroundColor: theme.card }]}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>{title}</Text>
      {children}
    </View>
  );

  const ProfileItem = ({
    icon: Icon,
    title,
    subtitle,
    onPress,
    rightComponent,
  }) => (
    <TouchableOpacity
      style={[styles.profileItem, { borderBottomColor: theme.border }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.profileItemLeft}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: theme.primary + "20" },
          ]}
        >
          <Icon size={20} color={theme.primary} />
        </View>
        <View style={styles.profileItemText}>
          <Text style={[styles.profileItemTitle, { color: theme.text }]}>
            {title}
          </Text>
          {subtitle && (
            <Text
              style={[
                styles.profileItemSubtitle,
                { color: theme.textSecondary },
              ]}
            >
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {rightComponent}
    </TouchableOpacity>
  );

  const StatCard = ({ title, value, color }) => (
    <View style={[styles.statCard, { backgroundColor: theme.background }]}>
      <Text style={[styles.statCardValue, { color }]}>{value}</Text>
      <Text style={[styles.statCardTitle, { color: theme.textSecondary }]}>
        {title}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.surface }]}>
          <View style={styles.headerContent}>
            <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
              <User size={32} color="#ffffff" />
            </View>
            <View style={styles.userInfo}>
              <Text style={[styles.userName, { color: theme.text }]}>
                {user?.name || "User"}
              </Text>
              <Text style={[styles.userEmail, { color: theme.textSecondary }]}>
                {user?.email || "user@example.com"}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          {/* Statistics */}
          <ProfileSection title="Statistics">
            <View style={styles.statsGrid}>
              <StatCard
                title="Total Tasks"
                value={statistics.total}
                color={theme.text}
              />
              <StatCard
                title="Completed"
                value={statistics.completed}
                color={theme.success}
              />
              <StatCard
                title="Pending"
                value={statistics.pending}
                color={theme.warning}
              />
              <StatCard
                title="Success Rate"
                value={`${statistics.completionRate}%`}
                color={theme.primary}
              />
            </View>
          </ProfileSection>

          {/* Account Settings */}
          <ProfileSection title="Account">
            <ProfileItem
              icon={User}
              title="Personal Information"
              subtitle="Update your profile details"
              onPress={() => {
                // Navigate to edit profile
                Alert.alert(
                  "Coming Soon",
                  "Profile editing will be available soon!"
                );
              }}
            />
            <ProfileItem
              icon={Mail}
              title="Email"
              subtitle={user?.email || "user@example.com"}
            />
            <ProfileItem
              icon={Calendar}
              title="Member Since"
              subtitle={new Date(
                user?.createdAt || Date.now()
              ).toLocaleDateString()}
            />
          </ProfileSection>

          {/* App Settings */}
          <ProfileSection title="Preferences">
            <ProfileItem
              icon={isDarkMode ? Moon : Sun}
              title="Theme"
              subtitle={isDarkMode ? "Dark Mode" : "Light Mode"}
              onPress={toggleTheme}
              rightComponent={
                <View
                  style={[
                    styles.toggle,
                    {
                      backgroundColor: isDarkMode
                        ? theme.primary
                        : theme.border,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.toggleCircle,
                      {
                        backgroundColor: "#ffffff",
                        transform: [{ translateX: isDarkMode ? 20 : 2 }],
                      },
                    ]}
                  />
                </View>
              }
            />
            <ProfileItem
              icon={Settings}
              title="Preferences"
              subtitle="Customize your app experience"
              onPress={() => {
                Alert.alert(
                  "Coming Soon",
                  "More preferences will be available soon!"
                );
              }}
            />
          </ProfileSection>

          {/* Sign Out */}
          <View style={styles.signOutContainer}>
            <CustomButton
              title="Sign Out"
              variant="danger"
              icon={LogOut}
              onPress={handleSignOut}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  userInfo: {
    marginLeft: 16,
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: "45%",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  statCardValue: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statCardTitle: {
    fontSize: 12,
    textAlign: "center",
  },
  profileItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  profileItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  profileItemText: {
    flex: 1,
  },
  profileItemTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 2,
  },
  profileItemSubtitle: {
    fontSize: 14,
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    position: "relative",
  },
  toggleCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    position: "absolute",
  },
  signOutContainer: {
    marginTop: 20,
    marginBottom: 40,
  },
});

export default ProfileScreen;
