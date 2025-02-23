import { create } from 'zustand';

interface UserState {
  user: any | null;
  level: string;
  progress: number;
  setUser: (user: any) => void;
  updateProgress: (progress: number) => void;
  updateLevel: (level: string) => void;
}

export const useUser = create<UserState>((set) => ({
  user: null,
  level: 'basico',
  progress: 0,
  setUser: (user) => set({ user }),
  updateProgress: (progress) => set({ progress }),
  updateLevel: (level) => set({ level }),
})); 