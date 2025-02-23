'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { exerciseService } from '@/services/api/exercises';

interface ExerciseProgressProps {
  id: number;
}

export function ExerciseProgress({ id }: ExerciseProgressProps) {
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const data = await exerciseService.getExerciseProgress(id);
        setProgress(data);
      } catch (error) {
        console.error('Error loading progress:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, [id]);

  if (loading) return null;

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Tu Progreso</h2>

      <Tabs defaultValue="stats">
        <TabsList className="mb-4">
          <TabsTrigger value="stats">Estadísticas</TabsTrigger>
          <TabsTrigger value="history">Historial</TabsTrigger>
        </TabsList>

        <TabsContent value="stats">
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-400">Progreso Total</span>
                <span className="text-sm font-medium">75%</span>
              </div>
              <Progress value={75} />
            </div>

            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progress?.history || []}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="points"
                    stroke="#EAB308"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <div className="space-y-4">
            {progress?.attempts?.map((attempt: any) => (
              <div
                key={attempt.id}
                className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50"
              >
                <div>
                  <p className="font-medium">{attempt.date}</p>
                  <p className="text-sm text-gray-400">
                    {attempt.points} puntos obtenidos
                  </p>
                </div>
                <div className="text-sm">
                  <span className={`px-2 py-1 rounded-full ${
                    attempt.completed
                      ? 'bg-green-400/10 text-green-400'
                      : 'bg-yellow-400/10 text-yellow-400'
                  }`}>
                    {attempt.completed ? 'Completado' : 'En progreso'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
} 