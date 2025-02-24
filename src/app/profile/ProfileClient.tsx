'use client';

import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileStats } from '@/components/profile/ProfileStats';
import { ProfileAchievements } from '@/components/profile/ProfileAchievements';
import { ProfileHistory } from '../../components/profile/ProfileHistory';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useProfile } from '@/hooks/useProfile';

export default function ProfileClient() {
  const { profile, achievements, isLoading, error } = useProfile();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg">{error.message}</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto py-8">
        <div className="bg-muted p-4 rounded-lg">No se encontró el perfil del usuario.</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="grid gap-8">
        <ProfileHeader profile={profile} />
        <ProfileStats stats={profile.stats} />
        <ProfileAchievements achievements={achievements} />
        <ProfileHistory />
      </div>
    </div>
  );
}
