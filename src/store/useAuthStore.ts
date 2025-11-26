import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, avatar?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
}

const USERS_KEY = "users";
const CURRENT_USER_KEY = "current_user";

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPassword = (password: string) => password.length >= 6;

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  register: async (name, email, password, avatar) => {
    if (!name || !email || !password) {
      alert("All fields are required");
      return false;
    }
    if (!isValidEmail(email)) {
      alert("Invalid email address");
      return false;
    }
    if (!isValidPassword(password)) {
      alert("Password must be at least 6 characters");
      return false;
    }

    const newUser: User = { name, email: email.toLowerCase(), password, avatar };

    try {
      const savedUsers = await AsyncStorage.getItem(USERS_KEY);
      const users: User[] = savedUsers ? JSON.parse(savedUsers) : [];

      // Check if email already exists
      if (users.find((u) => u.email === newUser.email)) {
        alert("User with this email already exists");
        return false;
      }

      users.push(newUser);
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));

      // Set current logged-in user
      set({ user: newUser });
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));

      return true;
    } catch (err) {
      console.error(err);
      alert("Failed to register");
      return false;
    }
  },

  login: async (email, password) => {
    email = email.trim().toLowerCase();
    password = password.trim();

    if (!isValidEmail(email)) {
      alert("Invalid email address");
      return false;
    }
    if (!isValidPassword(password)) {
      alert("Password must be at least 6 characters");
      return false;
    }

    try {
      const savedUsers = await AsyncStorage.getItem(USERS_KEY);
      if (!savedUsers) {
        alert("No registered user found");
        return false;
      }

      const users: User[] = JSON.parse(savedUsers);
      const found = users.find((u) => u.email === email && u.password === password);

      if (!found) {
        alert("Email or password incorrect");
        return false;
      }

      set({ user: found });
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(found));
      return true;
    } catch (err) {
      console.error(err);
      alert("Login failed");
      return false;
    }
  },

  logout: async () => {
    set({ user: null });
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
  },

  loadUser: async () => {
    try {
      const current = await AsyncStorage.getItem(CURRENT_USER_KEY);
      if (current) set({ user: JSON.parse(current) });
    } catch (err) {
      console.error(err);
    }
  },
}));
