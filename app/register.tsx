import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useAuthStore } from "../src/store/useAuthStore";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const register = useAuthStore((s) => s.register);
  const router = useRouter();

  // Email & password validation
  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPassword = (password: string) => password.length >= 6;

  const canRegister =
    name.trim().length > 0 && isValidEmail(email) && isValidPassword(password);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) setAvatar(result.assets[0].uri);
  };

  const handleRegister = async () => {
  if (!canRegister) return;

  const success = await register(name, email, password, avatar || undefined); // await here
  if (success) {
    Alert.alert("Success", "Registered successfully!");
    router.replace("/profile"); // navigate only after registration is complete
  } else {
    Alert.alert("Error", "Registration failed");
  }
};


  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Join CampusGuide and explore courses!</Text>

      <TouchableOpacity onPress={pickImage} style={styles.avatarWrapper}>
        <Image
          source={
            avatar
              ? { uri: avatar }
              : require("../assets/images/default_avatar.png")
          }
          style={styles.avatar}
        />
        {!avatar && (
          <View style={styles.iconWrapper}>
            <Ionicons name="camera" size={24} color="#fff" />
          </View>
        )}
      </TouchableOpacity>

      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {email.length > 0 && !isValidEmail(email) && (
        <Text style={styles.errorText}>Enter a valid email address</Text>
      )}

      <View style={{ width: "100%" }}>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          style={styles.input}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={{ position: "absolute", right: 15, top: 15 }}
        >
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={22}
            color="#555"
          />
        </TouchableOpacity>
      </View>
      {password.length > 0 && !isValidPassword(password) && (
        <Text style={styles.errorText}>
          Password must be at least 6 characters
        </Text>
      )}

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: canRegister ? "#0066ff" : "#aaa" },
        ]}
        disabled={!canRegister}
        onPress={handleRegister}
      >
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("./")} style={{ marginTop: 20 }}>
        <Text style={styles.loginText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 30,
    backgroundColor: "#e0f2ff",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#0066ff",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 30,
    textAlign: "center",
  },
  avatarWrapper: {
    position: "relative",
    marginBottom: 25,
    shadowColor: "#0066ff",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#0066ff",
  },
  iconWrapper: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#0066ff",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: "100%",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    backgroundColor: "#fff",
    fontSize: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  button: {
    width: "100%",
    paddingVertical: 15,
    borderRadius: 12,
    marginTop: 8,
    shadowColor: "#0066ff",
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  loginText: {
    color: "#0066ff",
    fontWeight: "600",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    alignSelf: "flex-start",
    marginBottom: 8,
    marginLeft: 5,
  },
});
