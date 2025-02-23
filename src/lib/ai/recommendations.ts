import { prisma } from '@/lib/prisma';
import { Analytics } from '../analytics/tracker';

export class RecommendationEngine {
  static async getExerciseRecommendations(userId: number) {
    // Obtener historial del usuario
    const userHistory = await prisma.progreso.findMany({
      where: { usuario_id: userId },
      include: { ejercicio: true }
    });

    // Obtener nivel actual
    const user = await prisma.usuarios.findUnique({
      where: { id: userId },
      select: { nivel: true }
    });

    // Algoritmo simple de recomendación basado en nivel y historial
    const recommendations = await prisma.ejercicios.findMany({
      where: {
        nivel_requerido: user?.nivel,
        NOT: {
          id: {
            in: userHistory.map(h => h.ejercicio_id)
          }
        }
      },
      orderBy: {
        puntos: 'desc'
      },
      take: 5
    });

    // Registrar recomendaciones para análisis
    Analytics.trackEvent('recommendations_generated', {
      userId,
      count: recommendations.length
    });

    return recommendations;
  }
} 