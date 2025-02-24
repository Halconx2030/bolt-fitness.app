'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Profile, UserStats, Achievement } from '@/types';

interface UseProfileReturn {
  profile: Profile | null;
  achievements: Achievement[];
  isLoading: boolean;
  error: Error | null;
}

export function useProfile(): UseProfileReturn {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchProfileData() {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) throw authError;
        if (!user) throw new Error('No user found');

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;

        const { data: statsData, error: statsError } = await supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (statsError) throw statsError;

        const { data: achievementsData, error: achievementsError } = await supabase
          .from('achievements')
          .select('*')
          .eq('user_id', user.id);

        if (achievementsError) throw achievementsError;

        // Convertir los datos a la nueva estructura
        const userStats: UserStats = {
          totalWorkouts: statsData.total_workouts,
          totalExercises: statsData.total_exercises,
          totalTime: statsData.total_time,
          streakDays: statsData.current_streak,
          achievements: statsData.achievements_unlocked,
          level: statsData.level,
          experience: statsData.experience_points,
          nextLevelExperience: statsData.next_level_experience,
          weightLifted: statsData.weight_lifted,
          caloriesBurned: statsData.calories_burned,
          personalBests: statsData.personal_bests || {},
        };

        // Convertir los datos del perfil
        const userProfile: Profile = {
          id: profileData.id,
          email: profileData.email,
          name: profileData.name,
          avatar: profileData.avatar_url,
          preferences: {
            theme: profileData.theme || 'system',
            language: profileData.language || 'es',
            notifications: {
              workoutReminders: true,
              achievements: true,
              socialInteractions: true,
              schedule: {
                enabled: true,
                days: [1, 3, 5],
                time: '08:00',
              },
            },
            privacySettings: {
              profileVisibility: 'public',
              activitySharing: true,
              showWorkoutHistory: true,
            },
          },
          stats: userStats,
          createdAt: new Date(profileData.created_at),
          updatedAt: new Date(profileData.updated_at),
        };

        setProfile(userProfile);

        setAchievements(
          achievementsData.map(achievement => ({
            id: achievement.id,
            name: achievement.name,
            description: achievement.description,
            type: achievement.type,
            requirements: {
              type: achievement.requirement_type,
              value: achievement.requirement_value,
            },
            reward: {
              experience: achievement.reward_experience,
              badge: achievement.reward_badge,
            },
          }))
        );
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfileData();
  }, [supabase]);

  return { profile, achievements, isLoading, error };
}
