'use client';

import { motion } from 'framer-motion';
import { UserHeader } from './UserHeader';
import { UserSidebar } from './UserSidebar';
import { useUser } from '@/hooks/useUser';

interface UserLayoutProps {
  children: React.ReactNode;
}

export const UserLayout = ({ children }: UserLayoutProps) => {
  const { user, level } = useUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <UserHeader user={user} level={level} />
      <div className="flex">
        <UserSidebar level={level} />
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 p-8"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}; 