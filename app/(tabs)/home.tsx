import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from "react-native";
import CourseCard from "../../components/healthCard";
import { Exercise, searchExercises } from "../../src/api/healthApi";
import { useAuthStore } from "../../src/store/useAuthStore";
import { CourseItem, useFavStore } from "../../src/store/useFavStore";
import { useThemeStore } from "../../src/store/useThemeStore";

export default function HomeScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const favs = useFavStore((s) => s.favs);
  const addFav = useFavStore((s) => s.addFav);
  const removeFav = useFavStore((s) => s.removeFav);
  const darkMode = useThemeStore((s) => s.darkMode);
  const toggleDarkMode = useThemeStore((s) => s.toggleDarkMode);
  const loadUser = useAuthStore((s) => s.loadUser);
  const [query, setQuery] = useState("");
  const [data, setData] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>("");
  const [searchTimeout, setSearchTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  const exerciseTypes = ["cardio", "olympic_weightlifting", "plyometrics", "powerlifting", "strength", "stretching"];

  const fetchData = async (searchQuery: string = "") => {
    setLoading(true);
    setError(null);
    try {
      // Use the search query if provided, otherwise use the component's query state
      const searchTerm = searchQuery !== undefined ? searchQuery : query;
      const exercises = await searchExercises(searchTerm);
      
      // Filter by selected type if any
      const filteredExercises = selectedType 
        ? exercises.filter((ex: Exercise) => ex.type.toLowerCase() === selectedType)
        : exercises;
      
      setData(filteredExercises);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch exercises. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Handle search input changes with debounce
  const handleSearch = (text: string) => {
    setQuery(text);
    
    // Clear previous timeout if it exists
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    // Set a new timeout
    const timeout = setTimeout(() => {
      fetchData(text);
    }, 500); // 500ms delay
    
    setSearchTimeout(timeout);
  };
  
  // Initial data fetch and fetch when selectedType changes
  useEffect(() => {
    fetchData();
    
    // Cleanup function to clear timeout when component unmounts
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [selectedType]);

  const toggleFav = (item: Exercise) => {
    if (!item.name) return;
    
    // Create a course item that matches the CourseItem interface
    const courseItem: CourseItem = {
      key: item.key || item.name, // Use existing key or fallback to name
      title: item.name,
      cover_i: 0 // Default value
    };

    // Check if the item is already in favorites
    const exists = favs.some(fav => fav.key === courseItem.key);
    
    if (exists) {
      removeFav(courseItem.key);
    } else {
      addFav(courseItem);
    }
  };

   useEffect(() => {
    loadUser(); // loads user from AsyncStorage
  }, []);

  const colors = darkMode
    ? { background: "#121212", text: "#f5f5f5", card: "#1e1e1e", input: "#222", placeholder: "#888", button: "#00bfff", buttonText: "#fff", infoText: "#ccc" }
    : { background: "#f9faff", text: "#1a1a1a", card: "#ffffff", input: "#f1f1f1", placeholder: "#aaa", button: "#0077ff", buttonText: "#fff", infoText: "#555" };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      
      {/* Premium Header */}
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <Text style={styles.title}>FitBuddy</Text>
        <Text style={styles.subtitle}>Your Personal Fitness Guide</Text>
        <View style={styles.typeContainer}>
          <Ionicons name="moon" size={20} color={darkMode ? "#fff" : "#000"} />
          <Switch
            value={darkMode}
            onValueChange={toggleDarkMode}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={darkMode ? "#f5dd4b" : "#f4f3f4"}
          />
        </View>
      </View>

      {/* Premium Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: colors.input }]}>
        <Ionicons name="search-outline" size={22} color={colors.placeholder} style={{ marginRight: 10 }} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search exercises..."
          placeholderTextColor={colors.placeholder}
          value={query}
          onChangeText={handleSearch}
          onSubmitEditing={() => fetchData(query)}
        />
        
        <View style={styles.typeContainer}>
          <Text style={styles.typeTitle}>Filter by Type:</Text>
          <View style={styles.typeButtons}>
            <TouchableOpacity 
              style={[styles.typeButton, !selectedType && styles.typeButtonActive]}
              onPress={() => {
                setSelectedType("");
                fetchData();
              }}
            >
              <Text style={styles.typeButtonText}>All</Text>
            </TouchableOpacity>
            {exerciseTypes.map((type) => (
              <TouchableOpacity 
                key={type}
                style={[
                  styles.typeButton, 
                  selectedType === type && styles.typeButtonActive
                ]}
                onPress={() => {
                  setSelectedType(type);
                  fetchData();
                }}
              >
                <Text style={styles.typeButtonText}>
                  {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Info Messages */}
      {loading && <Text style={[styles.infoText, { color: colors.infoText }]}>Loading exercises...</Text>}
      {error && <Text style={[styles.infoText, { color: "red" }]}>{error}</Text>}
      {!loading && data.length === 0 && <Text style={[styles.infoText, { color: colors.infoText }]}>No exercises found.</Text>}

      {/* Exercises List */}
      <FlatList
        data={data}
        keyExtractor={(item: Exercise) => item.name || String(Math.random())}
        renderItem={({ item }: { item: Exercise }) => {
          const itemKey = item.key || item.name;
          return (
            <CourseCard
              item={{
                ...item,
                title: item.name,
                author_name: [item.muscle],
                first_publish_year: item.difficulty,
              }}
              isFav={favs.some((f) => f.key === itemKey)}
              onFavPress={() => toggleFav(item)}
            />
          );
        }}
        contentContainerStyle={{ paddingBottom: 30, paddingTop: 10 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 20 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderRadius: 18,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: '#4CAF50',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },

  greetingWrapper: { flexDirection: "row", alignItems: "center" },
  greeting: { fontSize: 16, fontWeight: "500" },
  username: { fontSize: 20, fontWeight: "700" },
  darkModeToggle: { flexDirection: "row", alignItems: "center" },

  searchInput: {
    height: 50,
    borderWidth: 1,
    borderColor: "#4CAF50",
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff',
    elevation: 2,
  },
  typeContainer: {
    marginBottom: 20,
  },
  typeTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  typeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  typeButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    backgroundColor: '#e0e0e0',
    marginRight: 8,
    marginBottom: 8,
  },
  typeButtonActive: {
    backgroundColor: '#4CAF50',
  },
  typeButtonText: {
    fontSize: 12,
    color: '#333',
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 5,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },

  input: { flex: 1, fontSize: 16 },
  searchButton: { paddingVertical: 8, paddingHorizontal: 18, borderRadius: 10 },
  searchButtonText: { fontWeight: "600", fontSize: 15 },

  infoText: { textAlign: "center", fontSize: 15, marginVertical: 10 },
});
