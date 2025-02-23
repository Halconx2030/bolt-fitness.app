import { ReactNode } from 'react';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import { motion } from 'framer-motion';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background overflow-hidden">
      {/* Partículas de fondo */}
      <motion.div
        className="absolute h-64 w-64 rounded-full bg-primary/10 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <AnimatedContainer>
        <div className="relative w-full max-w-md rounded-2xl bg-secondary p-8 shadow-lg backdrop-blur-sm">
          {children}
        </div>
      </AnimatedContainer>
    </div>
  );
}
