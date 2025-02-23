import { prisma } from '@/lib/prisma';

export class AchievementSystem {
  static async checkAndAwardAchievements(userId: number) {
    const progress = await prisma.progreso.findMany({
      where: { usuario_id: userId }
    });

    const totalExercises = progress.length;
    const totalPoints = progress.reduce((sum, p) => sum + p.puntos_obtenidos, 0);

    // Verificar logros por cantidad de ejercicios
    if (totalExercises >= 10) {
      await this.awardAchievement(userId, 'beginner_athlete');
    }
    if (totalExercises >= 50) {
      await this.awardAchievement(userId, 'intermediate_athlete');
    }
    if (totalExercises >= 100) {
      await this.awardAchievement(userId, 'advanced_athlete');
    }

    // Verificar logros por puntos
    if (totalPoints >= 1000) {
      await this.awardAchievement(userId, 'point_master');
    }

    // Verificar racha diaria
    const streak = await this.calculateStreak(userId);
    if (streak >= 7) {
      await this.awardAchievement(userId, 'week_warrior');
    }
  }

  private static async awardAchievement(userId: number, achievementId: string) {
    const existing = await prisma.logros_usuario.findFirst({
      where: {
        usuario_id: userId,
        logro: { identificador: achievementId }
      }
    });

    if (!existing) {
      await prisma.logros_usuario.create({
        data: {
          usuario_id: userId,
          logro: { connect: { identificador: achievementId } }
        }
      });

      // Notificar al usuario
      await prisma.notificaciones.create({
        data: {
          usuario_id: userId,
          tipo: 'logro_obtenido',
          mensaje: `¡Has desbloqueado un nuevo logro!`
        }
      });
    }
  }

  private static async calculateStreak(userId: number) {
    const recentProgress = await prisma.progreso.findMany({
      where: { usuario_id: userId },
      orderBy: { fecha_completado: 'desc' },
      take: 30 // Últimos 30 días
    });

    let streak = 0;
    let currentDate = new Date();

    for (const progress of recentProgress) {
      const progressDate = progress.fecha_completado;
      const diffDays = Math.floor(
        (currentDate.getTime() - progressDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === streak) {
        streak++;
        currentDate = progressDate;
      } else {
        break;
      }
    }

    return streak;
  }
} 