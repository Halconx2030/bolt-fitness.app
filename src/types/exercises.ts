export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Exercise {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  difficulty: Difficulty;
  equipment: string[];
  muscles: string[];
  videoUrl?: string;
  instructions?: string[];
  tips?: string[];
}

export interface WorkoutExercise {
  exerciseId: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
  notes?: string;
}

export interface ExerciseProgress {
  id: string;
  userId: string;
  exerciseId: string;
  date: string;
  sets: {
    reps: number;
    weight?: number;
    duration?: number;
  }[];
  notes?: string;
}

export interface ExerciseStats {
  totalSets: number;
  totalReps: number;
  maxWeight: number;
  progressPercentage: number;
  lastSession?: {
    date: string;
    sets: number;
    reps: number;
    weight: number;
  };
}
