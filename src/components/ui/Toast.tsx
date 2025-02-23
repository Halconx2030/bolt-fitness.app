'use client';

import { useEffect } from 'react';
import { useToast } from '@/hooks/useToast';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

export const Toast = () => {
  const { message, type, isVisible, hideToast } = useToast();

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(hideToast, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, hideToast]);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'fixed bottom-4 right-4 z-50',
        'flex items-center gap-2 rounded-lg px-4 py-2 text-white',
        {
          'bg-green-500': type === 'success',
          'bg-red-500': type === 'error',
          'bg-blue-500': type === 'info',
          'bg-yellow-500': type === 'warning',
        }
      )}
      role="alert"
    >
      <span>{message}</span>
      <button
        onClick={hideToast}
        className="rounded-full p-1 hover:bg-white/20"
        aria-label="Cerrar"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
