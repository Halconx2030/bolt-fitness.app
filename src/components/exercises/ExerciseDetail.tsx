'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dumbbell, Trophy, Clock, ArrowLeft } from 'lucide-react';
import { exerciseService } from '@/services/api/exercises';
import { useRouter } from 'next/navigation';

interface ExerciseDetailProps {
  id: number;
}

export function ExerciseDetail({ id }: ExerciseDetailProps) {
  const [exercise, setExercise] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadExercise = async () => {
      try {
        const data = await exerciseService.getExerciseById(id);
        setExercise(data);
      } catch (error) {
        console.error('Error loading exercise:', error);
      } finally {
        setLoading(false);
      }
    };

    loadExercise();
  }, [id]);

  if (loading) return null;

  return (
    <Card className="p-6">
      <div className="flex items-center space-x-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold">{exercise.nombre}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Descripción</h3>
            <p className="text-gray-400">{exercise.descripcion}</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-gray-400" />
              <span>{exercise.tiempo_estimado || 15} minutos</span>
            </div>
            <div className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span>{exercise.puntos} puntos</span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Nivel Requerido</h3>
            <span className="px-3 py-1 bg-yellow-400/10 text-yellow-400 rounded-full">
              {exercise.nivel_requerido}
            </span>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Progreso General</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Completado por usuarios</span>
                <span>75%</span>
              </div>
              <Progress value={75} />
            </div>
          </div>

          <div className="space-y-4">
            <Button className="w-full" size="lg">
              <Dumbbell className="w-5 h-5 mr-2" />
              Comenzar Ejercicio
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
} 