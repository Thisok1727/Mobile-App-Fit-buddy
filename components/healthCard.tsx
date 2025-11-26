import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
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

  const getExerciseIcon = (equipment: string, muscle?: string) => {
    if (!equipment) return 'dumbbell';
    
    const equipmentLower = equipment.toLowerCase();
    const muscleLower = muscle?.toLowerCase() || '';
    
    // Equipment-based icons
    if (equipmentLower.includes('dumbbell')) {
      return muscleLower.includes('bicep') ? 'arm-flex' : 'dumbbell';
    }
    if (equipmentLower.includes('barbell')) return 'weight-lifter';
    if (equipmentLower === 'body weight') {
      if (muscleLower.includes('chest')) return 'human-handsup';
      if (muscleLower.includes('leg') || muscleLower.includes('quad') || muscleLower.includes('hamstring')) 
        return 'run-fast';
      if (muscleLower.includes('abs') || muscleLower.includes('abdominal')) 
        return 'ab-testing';
      if (muscleLower.includes('shoulder')) return 'arm-flex';
      return 'human-handsup';
    }
    if (equipmentLower.includes('machine')) {
      if (muscleLower.includes('chest')) return 'weight-lifter';
      if (muscleLower.includes('leg')) return 'weight-lifter';
      return 'weight-lifter';
    }
    if (equipmentLower.includes('cable')) return 'cable-data';
    if (equipmentLower.includes('kettlebell')) return 'kettlebell';
    if (equipmentLower.includes('band') || equipmentLower.includes('rope')) 
      return 'rope';
    if (equipmentLower.includes('e-z') || equipmentLower.includes('ez bar')) 
      return 'weight-lifter';
    if (equipmentLower.includes('medicine') || equipmentLower.includes('ball')) 
      return 'basketball';
    if (equipmentLower.includes('none') || equipmentLower === '') {
      if (muscleLower.includes('ab')) return 'ab-testing';
      if (muscleLower.includes('leg')) return 'run';
      if (muscleLower.includes('arm') || muscleLower.includes('bicep') || muscleLower.includes('tricep')) 
        return 'arm-flex';
      if (muscleLower.includes('chest')) return 'human-handsup';
      if (muscleLower.includes('back')) return 'human-handsdown';
      if (muscleLower.includes('shoulder')) return 'arm-flex';
    }
    
    // Muscle group fallbacks
    if (muscleLower.includes('chest')) return 'human-handsup';
    if (muscleLower.includes('bicep')) return 'arm-flex';
    if (muscleLower.includes('tricep')) return 'arm-flex';
    if (muscleLower.includes('shoulder')) return 'arm-flex';
    if (muscleLower.includes('leg') || muscleLower.includes('quad') || muscleLower.includes('hamstring')) 
      return 'run';
    if (muscleLower.includes('ab')) return 'ab-testing';
    if (muscleLower.includes('back')) return 'human-handsdown';
    
    return 'dumbbell'; // Default icon
  };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      activeOpacity={0.9}
      onPress={onPress}
    >
      {/* Exercise Icon */}
      <View style={[styles.image, { 
        backgroundColor: colors.imageBg, 
        justifyContent: 'center', 
        alignItems: 'center' 
      }]}>
        <MaterialCommunityIcons 
          name={getExerciseIcon(item.equipment, item.muscle)} 
          size={100} 
          color={colors.text} 
        />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text numberOfLines={2} style={[styles.title, { color: colors.text }]}>
          {item.name || item.title || "Exercise"}
        </Text>

        <Text style={[styles.meta, { color: colors.meta }]}>
          {item.muscle ? `Muscle: ${item.muscle.charAt(0).toUpperCase() + item.muscle.slice(1)}` : "No muscle group specified"}
        </Text>

        <Text style={[styles.meta, { color: colors.meta }]}>
          {item.difficulty ? `Difficulty: ${item.difficulty.charAt(0).toUpperCase() + item.difficulty.slice(1)}` : "No difficulty specified"}
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