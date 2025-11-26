import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { coverUrl } from "../../src/api/openLibrary";
import { useFavStore } from "../../src/store/useFavStore";
import { useThemeStore } from "../../src/store/useThemeStore";

export default function DetailsScreen() {
  const { id } = useLocalSearchParams();

  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const favs = useFavStore((s) => s.favs);
  const add = useFavStore((s) => s.addFav);
  const remove = useFavStore((s) => s.removeFav);

  const darkMode = useThemeStore((s) => s.darkMode);

  // THEME COLORS — all inside this ONE file
  const theme = darkMode
    ? {
        background: "#121212",
        card: "#1E1E1E",
        text: "#FFFFFF",
        description: "#CCCCCC",
        favButtonAdd: "#3A6BFF",
        favButtonRemove: "#FF4A4A",
      }
    : {
        background: "#F0F4FF",
        card: "#FFFFFF",
        text: "#333333",
        description: "#666666",
        favButtonAdd: "#4B7BE5",
        favButtonRemove: "#FF5C5C",
      };

  const isFav = favs.some((f) => f.key === id);

  const fetchDetails = async () => {
    try {
      const res = await axios.get(`https://openlibrary.org${id}.json`);
      setBook(res.data);
    } catch (err) {
      console.error("Error loading details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  if (loading) {
    return (
      <View
        style={[styles.loaderContainer, { backgroundColor: theme.background }]}
      >
        <ActivityIndicator size="large" color={theme.favButtonAdd} />
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Image
          source={{
            uri: coverUrl(book?.covers?.[0], "L") || undefined,
          }}
          style={styles.bookImage}
        />

        <Text style={[styles.title, { color: theme.text }]}>
          {book?.title}
        </Text>

        <Text style={[styles.description, { color: theme.description }]}>
          {book?.description?.value ||
            book?.description ||
            "No description available."}
        </Text>

        <TouchableOpacity
          onPress={() =>
            isFav
              ? remove(id as string)
              : add({
                  key: id as string,
                  title: book.title,
                  cover_i: book.covers?.[0],
                })
          }
          style={[
            styles.favButton,
            {
              backgroundColor: isFav
                ? theme.favButtonRemove
                : theme.favButtonAdd,
            },
          ]}
        >
          <Ionicons
            name={isFav ? "heart" : "heart-outline"}
            size={24}
            color="white"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.favButtonText}>
            {isFav ? "Remove from Favourites" : "Add to Favourites"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
    marginTop: 50,
    marginBottom: 50,
  },
  bookImage: {
    width: "100%",
    height: 320,
    borderRadius: 15,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  favButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 50,
  },
  favButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});
