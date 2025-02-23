'use client';

import { motion } from 'framer-motion';
import { ModeratorSidebar } from './ModeratorSidebar';
import { ModeratorHeader } from './ModeratorHeader';

interface ModeratorLayoutProps {
  children: React.ReactNode;
}

export const ModeratorLayout = ({ children }: ModeratorLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <ModeratorHeader />
      <div className="flex">
        <ModeratorSidebar />
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 p-8">
          {children}
        </motion.main>
      </div>
    </div>
  );
};
