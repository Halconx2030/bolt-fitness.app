import { prisma } from './prisma';
import { supabase } from './supabase';

export async function checkDatabaseHealth() {
  try {
    // Verificar conexión Prisma
    await prisma.$queryRaw`SELECT 1`;

    // Verificar conexión Supabase
    const { data, error } = await supabase.from('health_check').select('*').limit(1);

    if (error) throw error;

    return {
      status: 'healthy',
      prisma: 'connected',
      supabase: 'connected',
    };
  } catch (error) {
    console.error('Health check failed:', error);
    return {
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
}

export async function getDatabaseMetrics() {
  try {
    const { data: metrics } = await supabase.rpc('get_database_metrics');

    return metrics;
  } catch (error) {
    console.error('Failed to get metrics:', error);
    throw error;
  }
}
