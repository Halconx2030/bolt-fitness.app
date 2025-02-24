'use client';

import { motion } from 'framer-motion';
import { ModeratorHeader } from '@/components/moderator/ModeratorHeader';
import { User } from '@supabase/auth-helpers-nextjs';

interface ModeratorLayoutProps {
  children: React.ReactNode;
  user: User | null;
}

export function ModeratorLayout({ children, user }: ModeratorLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <ModeratorHeader user={user} />
      <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container py-8">
        {children}
      </motion.main>
    </div>
  );
}
