'use client';

import { motion } from 'framer-motion';
import { UserHeader } from '@/components/user/UserHeader';
import { useUser } from '@/hooks/useUser';

interface UserLayoutProps {
  children: React.ReactNode;
}

export function UserLayout({ children }: UserLayoutProps) {
  const { user, profile } = useUser();

  return (
    <div className="min-h-screen bg-background">
      <UserHeader user={user} profile={profile} />
      <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container py-8">
        {children}
      </motion.main>
    </div>
  );
}
