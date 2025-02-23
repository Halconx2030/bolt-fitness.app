import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Interceptor para añadir token
api.interceptors.request.use(config => {
  const { token } = useAuth.getState();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const userService = {
  async getProfile() {
    const response = await api.get('/users/profile');
    return response.data;
  },

  async updateProfile(userData: { nombre?: string; email?: string; password?: string }) {
    const response = await api.put('/users/profile', userData);
    return response.data;
  },

  async getProgress() {
    const response = await api.get('/users/progress');
    return response.data;
  },

  async getAchievements() {
    const response = await api.get('/users/achievements');
    return response.data;
  },

  async getNotifications() {
    const response = await api.get('/users/notifications');
    return response.data;
  },

  async markNotificationAsRead(notificationId: number) {
    const response = await api.put(`/users/notifications/${notificationId}/read`);
    return response.data;
  },

  async toggleTwoFactor(enabled: boolean) {
    const response = await api.put('/users/2fa', { enabled });
    return response.data;
  },

  async getRecentActivity() {
    const response = await api.get('/users/activity');
    return response.data;
  },

  async getActivityStats() {
    const response = await api.get('/users/activity/stats');
    return response.data;
  },

  async getExerciseHistory() {
    const response = await api.get('/users/history/exercises');
    return response.data;
  },

  async getWeeklyProgress() {
    const response = await api.get('/users/progress/weekly');
    return response.data;
  },

  async getDailyStreak() {
    const response = await api.get('/users/streak');
    return response.data;
  },

  async getAchievementHistory() {
    const response = await api.get('/users/history/achievements');
    return response.data;
  },

  async getCommentHistory() {
    const response = await api.get('/users/history/comments');
    return response.data;
  },

  async getActivityHistory() {
    const response = await api.get('/users/history/activity');
    return response.data;
  },

  getUserProfile: async (id: string) => {
    // Lógica para obtener el perfil del usuario
  },

  updateUserProfile: async (id: string, data: any) => {
    // Lógica para actualizar el perfil del usuario
  },

  getUserStats: async (id: string) => {
    // Lógica para obtener estadísticas del usuario
  },

  updateUserPreferences: async (id: string, preferences: any) => {
    // Lógica para actualizar preferencias del usuario
  },
};
