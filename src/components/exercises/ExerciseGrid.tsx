'use client';

import { useState, useEffect } from 'react';
import { exerciseService } from '@/services/api/exercises';
import { ExerciseCard } from './ExerciseCard';
import { useExerciseFilters } from '@/hooks/useExerciseFilters';

export function ExerciseGrid() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const { filters } = useExerciseFilters();

  useEffect(() => {
    const loadExercises = async () => {
      setLoading(true);
      try {
        const data = await exerciseService.getExercises(filters);
        setExercises(data);
      } catch (error) {
        console.error('Error loading exercises:', error);
      } finally {
        setLoading(false);
      }
    };

    loadExercises();
  }, [filters]);

  if (loading) return <ExercisesSkeleton />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {exercises.map((exercise) => (
        <ExerciseCard key={exercise.id} exercise={exercise} />
      ))}
    </div>
  );
} 