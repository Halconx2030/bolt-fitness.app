import { create } from 'zustand';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastState {
  message: string;
  type: ToastType;
  isVisible: boolean;
  showToast: (message: string, type: ToastType) => void;
  hideToast: () => void;
}

export const useToast = create<ToastState>(set => ({
  message: '',
  type: 'info',
  isVisible: false,
  showToast: (message, type) => {
    set({ message, type, isVisible: true });
    setTimeout(() => {
      set({ isVisible: false });
    }, 3000);
  },
  hideToast: () => set({ isVisible: false }),
}));
