import { create } from 'zustand';
import { exerciseService } from '@/services/api/exercises';
import { userService } from '@/services/api/users';

interface StatsState {
  dailyStats: any[];
  weeklyStats: any[];
  achievements: any[];
  loading: boolean;
  error: string | null;
  fetchStats: () => Promise<void>;
}

export const useStats = create<StatsState>((set) => ({
  dailyStats: [],
  weeklyStats: [],
  achievements: [],
  loading: false,
  error: null,

  fetchStats: async () => {
    set({ loading: true, error: null });
    try {
      const [progress, achievements] = await Promise.all([
        userService.getProgress(),
        userService.getAchievements()
      ]);

      // Procesar estadísticas diarias
      const dailyStats = processProgressData(progress, 'daily');
      const weeklyStats = processProgressData(progress, 'weekly');

      set({
        dailyStats,
        weeklyStats,
        achievements,
        loading: false
      });
    } catch (error) {
      set({ error: 'Error al cargar estadísticas', loading: false });
    }
  }
}));

function processProgressData(progress: any[], type: 'daily' | 'weekly') {
  if (!progress?.length) return [];

  if (type === 'daily') {
    // Agrupar por día y calcular puntos totales
    const dailyData = progress.reduce((acc: any, curr: any) => {
      const date = new Date(curr.fecha_completado).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = { date, points: 0, exercises: 0 };
      }
      acc[date].points += curr.puntos_obtenidos;
      acc[date].exercises += 1;
      return acc;
    }, {});

    return Object.values(dailyData).sort((a: any, b: any) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }

  if (type === 'weekly') {
    // Agrupar por semana
    const weeklyData = progress.reduce((acc: any, curr: any) => {
      const date = new Date(curr.fecha_completado);
      const week = `${date.getFullYear()}-W${getWeekNumber(date)}`;
      if (!acc[week]) {
        acc[week] = { week, exercises: 0, points: 0 };
      }
      acc[week].points += curr.puntos_obtenidos;
      acc[week].exercises += 1;
      return acc;
    }, {});

    return Object.values(weeklyData).sort((a: any, b: any) => 
      a.week.localeCompare(b.week)
    );
  }

  return [];
}

function getWeekNumber(date: Date) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
} 