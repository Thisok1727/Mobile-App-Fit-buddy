import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { coverUrl } from "../../src/api/openLibrary";
import { CourseItem, useFavStore } from "../../src/store/useFavStore";
import { useThemeStore } from "../../src/store/useThemeStore";
import { darkTheme, lightTheme } from "../../src/theme/colors";

export default function FavoriteScreen() {
  const favs = useFavStore((s) => s.favs);
  const removeFav = useFavStore((s) => s.removeFav);
  const router = useRouter();

  const darkMode = useThemeStore((s) => s.darkMode);
  const theme = darkMode ? darkTheme : lightTheme;

  if (favs.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Ionicons name="heart-dislike-outline" size={60} color={theme.text} />
        <Text style={[styles.emptyText, { color: theme.text }]}>
          Your favourite list is empty
        </Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: CourseItem }) => (
    <View style={[styles.card, { backgroundColor: theme.card }]}>
      {/* Image Section */}
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/details/[id]",
            params: { id: item.key },
          })
        }
      >
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: coverUrl(item.cover_i, "M") }}
            style={styles.cover}
          />

          {/* Heart badge (top-right) */}
          <View style={styles.heartBadge}>
            <Ionicons name="heart" size={20} color="#FF4C4C" />
          </View>
        </View>
      </TouchableOpacity>

      {/* Content */}
      <View style={styles.info}>
        <Text style={[styles.title, { color: theme.text }]}>
          {item.title}
        </Text>

        {/* Action Row */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            onPress={() => removeFav(item.key)}
            style={[styles.removeBtn, { backgroundColor: theme.removeBtn }]}
          >
            <Ionicons name="trash" size={18} color="white" />
            <Text style={styles.removeTxt}>Remove</Text>
          </TouchableOpacity>

          {/* View Button */}
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/details/[id]",
                params: { id: item.key },
              })
            }
            style={[styles.viewBtn, { borderColor: theme.text }]}
          >
            <Text style={[styles.viewTxt, { color: theme.text }]}>View</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <Text style={[styles.heading, { color: theme.text }]}>Favourites</Text>

      <FlatList
        data={favs}
        keyExtractor={(item) => item.key}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 10 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 32,
    fontWeight: "800",
    marginTop: 50,
    marginLeft: 16,
  },

  emptyText: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: "500",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    width: "100%",
    borderRadius: 16,
    marginBottom: 20,
    padding: 12,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    flexDirection: "row",
  },

  imageWrapper: {
    position: "relative",
    borderRadius: 14,
    overflow: "hidden",
  },

  cover: {
    width: 100,
    height: 150,
    borderRadius: 14,
  },

  heartBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    padding: 5,
    borderRadius: 20,
  },

  info: {
    flex: 1,
    marginLeft: 14,
    justifyContent: "space-between",
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },

  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  removeBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },

  removeTxt: {
    color: "white",
    marginLeft: 6,
    fontWeight: "600",
    fontSize: 14,
  },

  viewBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1.5,
  },

  viewTxt: {
    fontSize: 14,
    fontWeight: "600",
  },
});
