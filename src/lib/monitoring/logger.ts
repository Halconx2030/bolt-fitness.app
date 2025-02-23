import * as Sentry from '@sentry/nextjs';
import pino from 'pino';

/**
 * Configuración de niveles de log personalizados
 */
const customLevels = {
  http: 30,
  perf: 35,
};

/**
 * Logger principal de la aplicación
 * Utiliza Pino para logging estructurado y Sentry para errores
 */
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  customLevels,
  formatters: {
    level: label => {
      return { level: label };
    },
  },
  timestamp: () => `,"time":"${new Date().toISOString()}"`,
  base: {
    env: process.env.NODE_ENV,
    version: process.env.NEXT_PUBLIC_APP_VERSION,
  },
});

/**
 * Clase para manejar métricas de performance
 */
class PerformanceMetrics {
  private static instance: PerformanceMetrics;
  private metrics: Map<string, number[]>;

  private constructor() {
    this.metrics = new Map();
  }

  static getInstance(): PerformanceMetrics {
    if (!PerformanceMetrics.instance) {
      PerformanceMetrics.instance = new PerformanceMetrics();
    }
    return PerformanceMetrics.instance;
  }

  /**
   * Registra una métrica de performance
   * @param name - Nombre de la métrica
   * @param value - Valor a registrar
   */
  record(name: string, value: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)?.push(value);

    // Registrar en Sentry si excede el umbral
    if (value > 1000) {
      Sentry.captureMessage(`Performance degradada: ${name}`, {
        level: 'warning',
        extra: { value },
      });
    }
  }

  /**
   * Obtiene estadísticas de una métrica
   * @param name - Nombre de la métrica
   */
  getStats(name: string) {
    const values = this.metrics.get(name) || [];
    if (values.length === 0) return null;

    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;
    const sorted = [...values].sort((a, b) => a - b);
    const p95 = sorted[Math.floor(values.length * 0.95)];

    return {
      count: values.length,
      avg,
      min: Math.min(...values),
      max: Math.max(...values),
      p95,
    };
  }
}

/**
 * Middleware para logging de peticiones HTTP
 */
export const requestLogger = (handler: any) => async (req: any, res: any) => {
  const start = Date.now();

  try {
    const result = await handler(req, res);

    logger.info({
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: Date.now() - start,
    });

    return result;
  } catch (error) {
    logger.error({
      method: req.method,
      url: req.url,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      duration: Date.now() - start,
    });

    throw error;
  }
};

/**
 * Función para medir el tiempo de ejecución
 */
export function measurePerformance<T>(name: string, fn: () => Promise<T>): Promise<T> {
  const start = Date.now();

  return fn().finally(() => {
    const duration = Date.now() - start;
    PerformanceMetrics.getInstance().record(name, duration);

    logger.debug({
      metric: name,
      duration,
    });
  });
}

export { logger, PerformanceMetrics };
