import { Server as SocketServer } from 'socket.io';
import { prisma } from '@/lib/prisma';

export class NotificationService {
  private io: SocketServer;

  constructor(server: any) {
    this.io = new SocketServer(server);
    this.setupSocketHandlers();
  }

  private setupSocketHandlers() {
    this.io.on('connection', socket => {
      socket.on('join', (userId: number) => {
        socket.join(`user_${userId}`);
      });

      socket.on('leave', (userId: number) => {
        socket.leave(`user_${userId}`);
      });
    });
  }

  async sendNotification(userId: number, notification: any) {
    // Guardar en base de datos
    await prisma.notificaciones.create({
      data: {
        usuario_id: userId,
        tipo: notification.type,
        mensaje: notification.message,
      },
    });

    // Enviar en tiempo real
    this.io.to(`user_${userId}`).emit('notification', notification);
  }

  async markAsRead(notificationId: number) {
    await prisma.notificaciones.update({
      where: { id: notificationId },
      data: { leida: true },
    });
  }
}
