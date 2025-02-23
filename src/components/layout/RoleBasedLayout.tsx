'use client';

import { useAuth } from '@/hooks/useAuth';
import { AdminLayout } from './AdminLayout';
import { ModeratorLayout } from './moderator/ModeratorLayout';
import { DualRoleLayout } from './DualRoleLayout';
import { UserLayout } from './user/UserLayout';

interface RoleBasedLayoutProps {
  children: React.ReactNode;
  teacherView?: React.ReactNode;
  studentView?: React.ReactNode;
}

export const RoleBasedLayout = ({ 
  children, 
  teacherView, 
  studentView 
}: RoleBasedLayoutProps) => {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case 'admin':
      return <AdminLayout>{children}</AdminLayout>;
    case 'moderator':
      return <ModeratorLayout>{children}</ModeratorLayout>;
    case 'teacher':
      return (
        <DualRoleLayout
          teacherView={teacherView || children}
          studentView={studentView || children}
        />
      );
    default:
      return <UserLayout>{children}</UserLayout>;
  }
}; 