import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { coverUrl } from "../src/api/openLibrary";
import { useThemeStore } from "../src/store/useThemeStore";

interface CourseCardProps {
  item: any;
  onPress?: () => void;
  isFav?: boolean;
  onFavPress?: () => void;
}

export default function CourseCard({ item, onPress, isFav = false, onFavPress }: CourseCardProps) {
  const darkMode = useThemeStore((s) => s.darkMode);

  const colors = {
    card: darkMode ? "#1A1A1D" : "#ffffff",
    text: darkMode ? "#f5f5f5" : "#1a1a1a",
    meta: darkMode ? "#d1d1d1" : "#555",
    saveBtn: darkMode ? "#2d2d31" : "#f1f1f1",
    saveBtnActive: "#34c759",
    imageBg: darkMode ? "#2a2a2d" : "#ddd",
    border: darkMode ? "#2c2c2c" : "#e6e6e6",
  };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      activeOpacity={0.9}
      onPress={onPress}
    >
      {/* Cover Image */}
      <Image
        source={{ uri: coverUrl(item.cover_i, "M") || undefined }}
        style={[styles.image, { backgroundColor: colors.imageBg }]}
      />

      {/* Content */}
      <View style={styles.content}>
        <Text numberOfLines={2} style={[styles.title, { color: colors.text }]}>
          {item.title}
        </Text>

        <Text style={[styles.meta, { color: colors.meta }]}>
          {item.author_name?.[0] || "Unknown Author"}
        </Text>

        <Text style={[styles.meta, { color: colors.meta }]}>
          Published: {item.first_publish_year || "N/A"}
        </Text>

        {/* Save + Heart Row */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[
              styles.saveBtn,
              { backgroundColor: isFav ? colors.saveBtnActive : colors.saveBtn },
            ]}
            onPress={onFavPress}
          >
            <Ionicons
              name={isFav ? 'heart' : 'heart-outline'}
              size={20}
              color={isFav ? '#fff' : colors.text}
            />
          </TouchableOpacity>

          {/* Heart / Fav Icon */}
          <View style={styles.heartWrapper}>
            {/* Removed icon from HomeScreen */}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderRadius: 18,
    padding: 14,
    marginVertical: 12,
    borderWidth: 1,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },

  image: {
    width: "100%",
    height: 220,
    borderRadius: 15,
    marginBottom: 14,
  },

  content: {
    paddingHorizontal: 4,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
    letterSpacing: 0.3,
  },

  meta: {
    fontSize: 14,
    marginBottom: 3,
    opacity: 0.8,
  },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },

  saveBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },

  saveBtnText: {
    fontSize: 15,
    fontWeight: "600",
  },

  heartWrapper: {
    padding: 8,
    borderRadius: 50,
    backgroundColor: "transparent",
  },
});
