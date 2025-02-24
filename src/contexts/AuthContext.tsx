import { createContext, ReactNode, useContext } from 'react';
import { useAuth } from '@/hooks/useAuth';

// Exportar el contexto para que pueda ser usado directamente
export const AuthContext = createContext<ReturnType<typeof useAuth> | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};
