import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Interceptor para añadir token
api.interceptors.request.use((config) => {
  const { token } = useAuth.getState();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const exerciseService = {
  async getExercises(filters?: any) {
    const response = await api.get('/exercises', { params: filters });
    return response.data;
  },

  async getExerciseById(id: number) {
    const response = await api.get(`/exercises/${id}`);
    return response.data;
  },

  async createExercise(exerciseData: any) {
    const response = await api.post('/exercises', exerciseData);
    return response.data;
  },

  async updateProgress(exerciseId: number, progressData: any) {
    const response = await api.post(`/exercises/${exerciseId}/progress`, progressData);
    return response.data;
  },

  async getRecommendations() {
    const response = await api.get('/exercises/recommendations');
    return response.data;
  },

  async getExerciseComments(exerciseId: number) {
    const response = await api.get(`/exercises/${exerciseId}/comments`);
    return response.data;
  },

  async addExerciseComment(exerciseId: number, content: string) {
    const response = await api.post(`/exercises/${exerciseId}/comments`, {
      content
    });
    return response.data;
  },

  async likeComment(commentId: number) {
    const response = await api.post(`/comments/${commentId}/like`);
    return response.data;
  },

  async getExerciseProgress(exerciseId: number) {
    const response = await api.get(`/exercises/${exerciseId}/progress`);
    return response.data;
  }
}; 