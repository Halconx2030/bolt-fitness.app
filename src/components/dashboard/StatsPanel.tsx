'use client';

import React from 'react';
import { Trophy, Dumbbell, Flame, TrendingUp, Target } from 'lucide-react';
import StatItem from './StatItem';

interface Stats {
  totalWorkouts: number;
  completedExercises: number;
  achievementsUnlocked: number;
  currentStreak: number;
  weeklyProgress: number;
}

interface StatsPanelProps {
  stats: Stats | null;
  isLoading?: boolean;
  error?: string;
}

const StatSkeleton = () => (
  <div data-testid="stat-skeleton" className="h-24 bg-background/50 rounded-lg animate-pulse" />
);

const StatsPanel: React.FC<StatsPanelProps> = ({ stats, isLoading = false, error }) => {
  if (error) {
    return <div role="alert">{error}</div>;
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <StatSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-4 bg-secondary rounded-lg">
        <p className="text-gray-400 text-center">No hay estadísticas disponibles</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <StatItem icon={Dumbbell} value={stats.totalWorkouts} label="Entrenamientos" />
      <StatItem icon={Target} value={stats.completedExercises} label="Ejercicios" />
      <StatItem icon={Trophy} value={stats.achievementsUnlocked} label="Logros" />
      <StatItem icon={Flame} value={stats.currentStreak} label="Racha" />
      <div className="p-4 bg-background/50 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          <span className="text-sm text-gray-400">Progreso Semanal</span>
        </div>
        <div className="h-2 bg-gray-700 rounded-full">
          <div
            role="progressbar"
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${stats.weeklyProgress}%` }}
          />
        </div>
        <p className="mt-2 text-right text-sm font-medium">{stats.weeklyProgress}%</p>
      </div>
    </div>
  );
};

export default StatsPanel;
