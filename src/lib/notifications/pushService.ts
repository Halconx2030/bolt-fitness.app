import { logger } from '@/lib/monitoring/logger';

/**
 * Tipos de notificaciones soportadas
 */
export enum NotificationType {
  WORKOUT_REMINDER = 'workout_reminder',
  GOAL_ACHIEVED = 'goal_achieved',
  NEW_ACHIEVEMENT = 'new_achievement',
  STREAK_MILESTONE = 'streak_milestone',
  HYDRATION_REMINDER = 'hydration_reminder',
}

interface NotificationTemplate {
  title: string;
  body: string;
  icon?: string;
  data?: Record<string, any>;
}

/**
 * Plantillas predefinidas para cada tipo de notificación
 */
const notificationTemplates: Record<NotificationType, (data: any) => NotificationTemplate> = {
  [NotificationType.WORKOUT_REMINDER]: data => ({
    title: '¡Hora de entrenar! 💪',
    body: `Tu rutina ${data.workoutName} está programada para ahora`,
    icon: '/icons/workout-96x96.png',
    data: {
      url: `/workout/${data.workoutId}`,
      workoutId: data.workoutId,
    },
  }),

  [NotificationType.GOAL_ACHIEVED]: data => ({
    title: '¡Objetivo cumplido! 🎯',
    body: `¡Felicitaciones! Has alcanzado tu objetivo: ${data.goalName}`,
    icon: '/icons/achievement-96x96.png',
    data: {
      url: '/progress',
      goalId: data.goalId,
    },
  }),

  [NotificationType.NEW_ACHIEVEMENT]: data => ({
    title: '¡Nuevo logro desbloqueado! 🏆',
    body: `Has desbloqueado: ${data.achievementName}`,
    icon: '/icons/trophy-96x96.png',
    data: {
      url: '/achievements',
      achievementId: data.achievementId,
    },
  }),

  [NotificationType.STREAK_MILESTONE]: data => ({
    title: '¡Racha impresionante! 🔥',
    body: `¡${data.days} días seguidos! Mantén el ritmo`,
    icon: '/icons/streak-96x96.png',
    data: {
      url: '/stats',
    },
  }),

  [NotificationType.HYDRATION_REMINDER]: data => ({
    title: '¡Hidratación! 💧',
    body: 'Recuerda beber agua para mantener tu rendimiento',
    icon: '/icons/water-96x96.png',
    data: {
      url: '/hydration',
    },
  }),
};

/**
 * Servicio para gestionar notificaciones push
 */
export class PushNotificationService {
  /**
   * Solicita permiso para enviar notificaciones
   */
  static async requestPermission(): Promise<boolean> {
    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      logger.error('Error al solicitar permiso de notificaciones:', error);
      return false;
    }
  }

  /**
   * Registra el Service Worker para notificaciones
   */
  static async registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.register('/sw.js');
        return registration;
      }
      return null;
    } catch (error) {
      logger.error('Error al registrar Service Worker:', error);
      return null;
    }
  }

  /**
   * Envía una notificación push
   */
  static async sendNotification(
    type: NotificationType,
    data: any,
    userId: string
  ): Promise<boolean> {
    try {
      const template = notificationTemplates[type](data);
      const registration = await this.registerServiceWorker();

      if (!registration) {
        throw new Error('Service Worker no registrado');
      }

      // Registrar el envío en los logs
      logger.info({
        event: 'push_notification_sent',
        type,
        userId,
        data: template,
      });

      await registration.showNotification(template.title, {
        body: template.body,
        icon: template.icon || '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        vibrate: [100, 50, 100],
        data: {
          ...template.data,
          notificationType: type,
        },
      });

      return true;
    } catch (error) {
      logger.error('Error al enviar notificación:', error);
      return false;
    }
  }

  /**
   * Programa una notificación para ser enviada en el futuro
   */
  static async scheduleNotification(
    type: NotificationType,
    data: any,
    userId: string,
    scheduledTime: Date
  ): Promise<boolean> {
    try {
      const delay = scheduledTime.getTime() - Date.now();
      if (delay <= 0) {
        return this.sendNotification(type, data, userId);
      }

      setTimeout(() => {
        this.sendNotification(type, data, userId);
      }, delay);

      logger.info({
        event: 'notification_scheduled',
        type,
        userId,
        scheduledTime,
      });

      return true;
    } catch (error) {
      logger.error('Error al programar notificación:', error);
      return false;
    }
  }
}
