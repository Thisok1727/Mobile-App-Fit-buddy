import axios from 'axios';

const API_KEY = 'kbkBsrmxjGPMzGW1rTCIJA==kzdmGfJNgbtKdX92';
const BASE_URL = 'https://api.api-ninjas.com/v1/exercises';

// Create axios instance with default headers
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'X-Api-Key': API_KEY,
    'Content-Type': 'application/json',
  },
});

export interface Exercise {
  name: string;
  type: string;
  muscle: string;
  equipment: string;
  difficulty: string;
  instructions: string;
  key?: string;
  cover_i?: string;
  author_name?: string[];
  first_publish_year?: string | number;
}

export const searchExercises = async (query: string = ''): Promise<Exercise[]> => {
  try {
    // If query is empty, return some default exercises
    if (!query.trim()) {
      query = 'biceps'; // Default search
    }

    // First try to search by name
    let response = await apiClient.get('', {
      params: { name: query }
    });

    // If no results, try searching by muscle group
    if (!response.data || response.data.length === 0) {
      response = await apiClient.get('', {
        params: { muscle: query.toLowerCase() }
      });
    }

    // If still no results, return empty array
    if (!response.data || response.data.length === 0) {
      return [];
    }

    return response.data.map((exercise: Exercise, index: number) => ({
      ...exercise,
      key: `${exercise.name}-${index}`,
      cover_i: `https://api.lorem.space/image/dumbbell?w=150&h=150&${Date.now()}`,
      // Adding these to maintain compatibility with existing components
      author_name: [exercise.muscle],
      first_publish_year: exercise.difficulty,
    }));
  } catch (error) {
    console.error('Error fetching exercises:', error);
    throw error;
  }
};
