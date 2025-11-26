import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "../src/store/useAuthStore";
import { Ionicons } from "@expo/vector-icons";

export default function Login() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) return alert("All fields are required");
     const success = await login(email, password); // login checks AsyncStorage
  if (success) {
    router.replace("./(tabs)/home");
  }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.title}>CampusGuide</Text>
      <Text style={styles.subtitle}>Welcome back! Please login to continue</Text>

      {/* Email Input */}
      <View style={styles.inputWrapper}>
        <Ionicons name="mail-outline" size={22} color="#777" style={styles.icon} />
        <TextInput
          placeholder="Email"
          placeholderTextColor="#777"
          style={styles.input}
          onChangeText={setEmail}
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* Password Input */}
      <View style={styles.inputWrapper}>
        <Ionicons name="lock-closed-outline" size={22} color="#777" style={styles.icon} />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#777"
          style={styles.input}
          onChangeText={setPassword}
          value={password}
          secureTextEntry
        />
      </View>

      {/* Login Button */}
      <TouchableOpacity style={styles.btn} onPress={handleLogin}>
        <Text style={styles.btnText}>Login</Text>
      </TouchableOpacity>

      {/* Create Account Link */}
      <TouchableOpacity onPress={() => router.push("/register")}>
        <Text style={styles.createText}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingTop: 120,
  },
  title: {
    fontSize: 34,
    fontWeight: "800",
    color: "#0066ff",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 40,
    textAlign: "center",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 20,
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#111",
  },
  btn: {
    width: "100%",
    backgroundColor: "#0066ff",
    paddingVertical: 15,
    borderRadius: 12,
    marginTop: 10,
    shadowColor: "#0066ff",
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  btnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  createText: {
    marginTop: 25,
    color: "#0066ff",
    fontWeight: "600",
    fontSize: 15,
  },
});
