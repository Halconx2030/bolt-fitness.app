import { User } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { create } from 'zustand';

interface UserState {
  user: User | null;
  level: string;
  progress: number;
  setUser: (user: User) => void;
  updateProgress: (progress: number) => void;
  updateLevel: (level: string) => void;
}

export type UserProfile = {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  preferences?: UserPreferences;
};

export type UserPreferences = {
  theme: 'light' | 'dark';
  notifications: boolean;
  language: string;
};

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ... existing code ...
  }, []);

  return { user, loading };
};

export const useUserZustand = create<UserState>(set => ({
  user: null,
  level: 'basico',
  progress: 0,
  setUser: user => set({ user }),
  updateProgress: progress => set({ progress }),
  updateLevel: level => set({ level }),
}));
