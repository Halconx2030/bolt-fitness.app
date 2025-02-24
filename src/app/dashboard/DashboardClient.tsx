'use client';

import { useEffect, useState } from 'react';
import StatsPanel from '@/components/dashboard/StatsPanel';
import NextExercises from '@/components/dashboard/NextExercises';
import RecentActivity from '@/components/dashboard/RecentActivity';
import { UserStats } from '@/types';

export default function DashboardClient() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        // Simular carga de datos
        await new Promise(resolve => setTimeout(resolve, 1000));
        setStats({
          totalWorkouts: 24,
          totalExercises: 156,
          totalTime: 2700, // 45 minutos en segundos
          streakDays: 5,
          achievements: 8,
          level: 5,
          experience: 1250,
          nextLevelExperience: 2000,
          weightLifted: 2500,
          caloriesBurned: 1200,
          personalBests: {
            squat: {
              weight: 100,
              reps: 12,
              date: new Date(),
            },
            'bench-press': {
              weight: 80,
              reps: 10,
              date: new Date(),
            },
          },
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar estadísticas');
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <main className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <StatsPanel stats={stats} isLoading={isLoading} error={error || undefined} />
        </div>
        <div className="space-y-8">
          <NextExercises />
          <RecentActivity activities={[]} />
        </div>
      </div>
    </main>
  );
}
