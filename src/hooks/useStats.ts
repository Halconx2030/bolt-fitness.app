import { create } from 'zustand';
import { userService } from '@/services/api/users';

interface StatsState {
  dailyStats: DailyStats[];
  weeklyStats: WeeklyStats[];
  achievements: Achievement[];
  loading: boolean;
  error: string | null;
  fetchStats: () => Promise<void>;
}

interface ProgressData {
  fecha_completado: string;
  puntos_obtenidos: number;
}

interface DailyStats {
  date: string;
  points: number;
  exercises: number;
}

interface WeeklyStats {
  week: string;
  exercises: number;
  points: number;
}

interface DailyDataAccumulator {
  [key: string]: DailyStats;
}

interface WeeklyDataAccumulator {
  [key: string]: WeeklyStats;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  progress?: number;
  date_achieved?: string;
}

export const useStats = create<StatsState>(set => ({
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
        userService.getAchievements(),
      ]);

      // Procesar estadísticas diarias
      const dailyStats = processProgressData(progress, 'daily');
      const weeklyStats = processProgressData(progress, 'weekly');

      set({
        dailyStats,
        weeklyStats,
        achievements,
        loading: false,
      });
    } catch (error) {
      set({ error: 'Error al cargar estadísticas', loading: false });
    }
  },
}));

function processProgressData(
  progress: ProgressData[],
  type: 'daily' | 'weekly'
): DailyStats[] | WeeklyStats[] {
  if (!progress?.length) return [];

  if (type === 'daily') {
    const dailyData = progress.reduce((acc: DailyDataAccumulator, curr: ProgressData) => {
      const date = new Date(curr.fecha_completado).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = { date, points: 0, exercises: 0 };
      }
      acc[date].points += curr.puntos_obtenidos;
      acc[date].exercises += 1;
      return acc;
    }, {});

    return Object.values(dailyData).sort(
      (a: DailyStats, b: DailyStats) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }

  if (type === 'weekly') {
    const weeklyData = progress.reduce((acc: WeeklyDataAccumulator, curr: ProgressData) => {
      const date = new Date(curr.fecha_completado);
      const week = `${date.getFullYear()}-W${getWeekNumber(date)}`;
      if (!acc[week]) {
        acc[week] = { week, exercises: 0, points: 0 };
      }
      acc[week].points += curr.puntos_obtenidos;
      acc[week].exercises += 1;
      return acc;
    }, {});

    return Object.values(weeklyData).sort((a: WeeklyStats, b: WeeklyStats) =>
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
