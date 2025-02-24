'use client';

import { useState, useCallback } from 'react';

export type Role = 'user' | 'admin';

export function useRole() {
  const [role, setRole] = useState<Role>('user');

  const toggleRole = useCallback(() => {
    setRole(prev => (prev === 'user' ? 'admin' : 'user'));
  }, []);

  return {
    role,
    toggleRole,
    isAdmin: role === 'admin',
    isUser: role === 'user',
  };
}
