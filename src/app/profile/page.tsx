import { Suspense } from 'react';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileStats } from '@/components/profile/ProfileStats';
import { ProfileAchievements } from '@/components/profile/ProfileAchievements';
import { ProfileHistory } from '@/components/profile/ProfileHistory';
import { ProfileSkeleton } from '@/components/skeletons/ProfileSkeleton';

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <Suspense fallback={<ProfileSkeleton />}>
        <ProfileHeader />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <ProfileStats />
            <ProfileHistory />
          </div>
          <div>
            <ProfileAchievements />
          </div>
        </div>
      </Suspense>
    </div>
  );
} 