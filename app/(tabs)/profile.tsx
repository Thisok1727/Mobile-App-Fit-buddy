import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Switch,
} from "react-native";
import { useAuthStore } from "../../src/store/useAuthStore";
import { useThemeStore } from "../../src/store/useThemeStore";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import React from "react";

export default function Profile() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  const darkMode = useThemeStore((s) => s.darkMode);
  const toggleDarkMode = useThemeStore((s) => s.toggleDarkMode);

  const colors = darkMode
    ? {
        background: "#0d0d0d",
        card: "rgba(255,255,255,0.05)",
        text: "#f5f5f5",
        accent: "#4D9EFF",
        border: "rgba(255,255,255,0.2)",
      }
    : {
        background: "#e8f1ff",
        card: "rgba(255,255,255,0.8)",
        text: "#222",
        accent: "#0066ff",
        border: "rgba(0,0,0,0.1)",
      };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* GLASS CARD */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {/* Avatar section */}
        <View style={styles.avatarWrapper}>
          {user?.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <Ionicons name="person-circle-outline" size={130} color={colors.accent} />
          )}
        </View>

        {/* User name + email */}
        <Text style={[styles.name, { color: colors.text }]}>
          {user?.name || "User Name"}
        </Text>
        <Text style={[styles.email, { color: colors.text }]}>
          {user?.email || "Email not available"}
        </Text>

        {/* Divider */}
        <View style={[styles.divider, { borderColor: colors.border }]} />

        {/* Settings Row */}
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="moon" size={22} color={colors.accent} />
            <Text style={[styles.rowText, { color: colors.text }]}>Dark Mode</Text>
          </View>
          <Switch value={darkMode} onValueChange={toggleDarkMode} />
        </View>

        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="notifications-outline" size={22} color={colors.accent} />
            <Text style={[styles.rowText, { color: colors.text }]}>Notifications</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.text} />
        </View>

        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="settings-outline" size={22} color={colors.accent} />
            <Text style={[styles.rowText, { color: colors.text }]}>Account Settings</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.text} />
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => {
            logout();
            router.replace("/");
          }}
        >
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
  },

  card: {
    width: "100%",
    paddingVertical: 35,
    paddingHorizontal: 25,
    borderRadius: 28,
    borderWidth: 1,
    backdropFilter: "blur(20px)",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
  },

  avatarWrapper: {
    alignItems: "center",
    marginBottom: 18,
  },

  avatar: {
    width: 130,
    height: 130,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: "#4D9EFF",
  },

  name: {
    fontSize: 26,
    textAlign: "center",
    fontWeight: "700",
  },

  email: {
    marginTop: 4,
    fontSize: 15,
    textAlign: "center",
    opacity: 0.8,
  },

  divider: {
    marginVertical: 25,
    borderBottomWidth: 1,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    marginBottom: 8,
  },

  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  rowText: {
    marginLeft: 10,
    fontSize: 17,
    fontWeight: "500",
  },

  logoutButton: {
    backgroundColor: "#ff4d4d",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 25,
  },

  logoutText: {
    color: "#fff",
    marginLeft: 8,
    fontSize: 18,
    fontWeight: "600",
  },
});
