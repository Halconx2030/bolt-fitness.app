import { create } from 'zustand';
import { userService } from '@/services/api/users';

interface Notification {
  id: number;
  tipo: string;
  mensaje: string;
  leida: boolean;
  fecha_creacion: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  addNotification: (notification: Notification) => void;
}

export const useNotifications = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,

  fetchNotifications: async () => {
    set({ loading: true });
    try {
      const notifications = await userService.getNotifications();
      set({
        notifications,
        unreadCount: notifications.filter((n: Notification) => !n.leida).length
      });
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      set({ loading: false });
    }
  },

  markAsRead: async (id: number) => {
    try {
      await userService.markNotificationAsRead(id);
      set(state => ({
        notifications: state.notifications.map(n =>
          n.id === id ? { ...n, leida: true } : n
        ),
        unreadCount: state.unreadCount - 1
      }));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  },

  addNotification: (notification: Notification) => {
    set(state => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1
    }));
  }
})); 