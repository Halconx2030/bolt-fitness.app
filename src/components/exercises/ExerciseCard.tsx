'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dumbbell, Trophy, Clock } from 'lucide-react';
import Link from 'next/link';

interface ExerciseCardProps {
  exercise: {
    id: number;
    nombre: string;
    descripcion: string;
    nivel_requerido: string;
    puntos: number;
    tiempo_estimado?: number;
  };
}

export function ExerciseCard({ exercise }: ExerciseCardProps) {
  return (
    <Card className="overflow-hidden hover:ring-2 hover:ring-yellow-400/20 transition">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-400/10 rounded-lg">
              <Dumbbell className="w-5 h-5 text-yellow-400" />
            </div>
            <h3 className="font-semibold text-lg">{exercise.nombre}</h3>
          </div>
          <div className="flex items-center space-x-2">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium">{exercise.puntos} pts</span>
          </div>
        </div>

        <p className="mt-3 text-sm text-gray-400 line-clamp-2">
          {exercise.descripcion}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Clock className="w-4 h-4" />
            <span>{exercise.tiempo_estimado || 15} min</span>
          </div>
          <span className="text-sm font-medium px-2 py-1 bg-yellow-400/10 text-yellow-400 rounded-full">
            {exercise.nivel_requerido}
          </span>
        </div>

        <div className="mt-6">
          <Link href={`/exercises/${exercise.id}`}>
            <Button className="w-full" variant="secondary">
              Comenzar Ejercicio
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
} 