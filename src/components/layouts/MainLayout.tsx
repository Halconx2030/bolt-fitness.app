import { ReactNode } from 'react';
import Navbar from '@/components/layout/Navbar';
import { motion } from 'framer-motion';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 pt-24"
      >
        {children}
      </motion.main>
    </div>
  );
}
