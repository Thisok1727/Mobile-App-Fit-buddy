import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { searchExercises } from '../../../src/api/healthApi';
import { useFavStore } from '../../../src/store/useFavStore';

export default function ExerciseDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const favs = useFavStore((s: any) => s.favs);
  const addFav = useFavStore((s: any) => s.addFav);
  const removeFav = useFavStore((s: any) => s.removeFav);
  
  const [exercise, setExercise] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadExercise = async () => {
      try {
        // Try to find in favorites first
        const favExercise = favs.find((f: any) => f.key === id);
        if (favExercise) {
          setExercise(favExercise);
          setLoading(false);
          return;
        }

        // If not in favorites, try to fetch it
        const exercises = await searchExercises(id as string);
        if (exercises && exercises.length > 0) {
          setExercise(exercises[0]);
        }
      } catch (error) {
        console.error('Error loading exercise:', error);
      } finally {
        setLoading(false);
      }
    };

    loadExercise();
  }, [id]);

  const isFavorite = favs.some((f: any) => f.key === id);

  const toggleFavorite = () => {
    if (!exercise) return;
    
    if (isFavorite) {
      removeFav(exercise.key);
    } else {
      addFav(exercise);
    }
  };

  const shareExercise = async () => {
    if (!exercise) return;
    
    try {
      await Share.share({
        message: `Check out this exercise: ${exercise.name}\n\nType: ${exercise.type}\nMuscle: ${exercise.muscle}\nDifficulty: ${exercise.difficulty}\n\n${exercise.instructions}`,
        title: exercise.name,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading exercise details...</Text>
      </View>
    );
  }

  if (!exercise) {
    return (
      <View style={styles.container}>
        <Text>Exercise not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#4CAF50" />
        </TouchableOpacity>
        <Text style={styles.title}>{exercise.name}</Text>
        <View style={styles.actions}>
          <TouchableOpacity onPress={toggleFavorite} style={styles.actionButton}>
            <Ionicons 
              name={isFavorite ? 'heart' : 'heart-outline'} 
              size={24} 
              color={isFavorite ? '#FF4081' : '#666'} 
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={shareExercise} style={styles.actionButton}>
            <Ionicons name="share-social-outline" size={24} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Ionicons name="barbell-outline" size={20} color="#4CAF50" />
            <Text style={styles.metaText}>{exercise.type}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="fitness-outline" size={20} color="#4CAF50" />
            <Text style={styles.metaText}>{exercise.muscle}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="speedometer-outline" size={20} color="#4CAF50" />
            <Text style={styles.metaText}>{exercise.difficulty}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          <Text style={styles.instructions}>{exercise.instructions || 'No instructions available.'}</Text>
        </View>

        {exercise.equipment && exercise.equipment !== 'body weight' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Equipment Needed</Text>
            <Text style={styles.text}>{exercise.equipment}</Text>
          </View>
        )}

        <View style={styles.notesSection}>
          <Text style={styles.notesTitle}>Pro Tips</Text>
          <Text style={styles.notesText}>
            • Focus on proper form to prevent injuries
            • Breathe steadily during the exercise
            • Start with lighter intensity and gradually increase
            • Stay hydrated throughout your workout
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    color: '#333',
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  detailsContainer: {
    padding: 16,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  metaItem: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: '30%',
    marginBottom: 10,
  },
  metaText: {
    marginTop: 6,
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  instructions: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
  text: {
    fontSize: 16,
    color: '#444',
    lineHeight: 22,
  },
  notesSection: {
    backgroundColor: '#f0f7ff',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  notesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976D2',
    marginBottom: 8,
  },
  notesText: {
    fontSize: 14,
    color: '#1976D2',
    lineHeight: 20,
  },
});
