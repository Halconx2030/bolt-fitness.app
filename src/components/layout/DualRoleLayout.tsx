'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRole } from '@/hooks/useRole';
import { RoleSwitch } from '@/components/ui/role-switch';

interface DualRoleLayoutProps {
  studentView: React.ReactNode;
  teacherView: React.ReactNode;
}

export const DualRoleLayout = ({ studentView, teacherView }: DualRoleLayoutProps) => {
  const { role, isTeacher, toggleRole } = useRole();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleRoleSwitch = async () => {
    setIsTransitioning(true);
    await toggleRole();
    setIsTransitioning(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {isTeacher && (
        <div className="fixed top-4 right-4 z-50">
          <RoleSwitch 
            currentRole={role} 
            onChange={handleRoleSwitch}
            disabled={isTransitioning}
          />
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={role}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="container mx-auto px-4 py-8"
        >
          {role === 'teacher' ? teacherView : studentView}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}; 