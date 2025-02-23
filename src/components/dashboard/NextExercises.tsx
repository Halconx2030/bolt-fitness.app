'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { exerciseService } from '@/services/api/exercises';
import { Dumbbell } from 'lucide-react';

export function NextExercises() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadExercises = async () => {
      try {
        const data = await exerciseService.getRecommendations();
        setExercises(data);
      } catch (error) {
        console.error('Error loading exercises:', error);
      } finally {
        setLoading(false);
      }
    };

    loadExercises();
  }, []);

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Próximos Ejercicios</h3>
      <div className="space-y-4">
        {exercises.map((exercise: any) => (
          <div
            key={exercise.id}
            className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition"
          >
            <div className="flex items-center space-x-3">
              <Dumbbell className="w-5 h-5 text-yellow-400" />
              <div>
                <p className="font-medium">{exercise.nombre}</p>
                <p className="text-sm text-gray-400">{exercise.nivel_requerido}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              Comenzar
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
} 