import * as Sentry from '@sentry/nextjs';

/**
 * Configuración de alertas y reglas de monitoreo
 */
export const alertRules = {
  // Alertas de errores
  errors: {
    // Alerta si hay muchos errores en poco tiempo
    highErrorRate: {
      threshold: 10,
      timeWindow: 60, // 1 minuto
      action: (count: number) => {
        Sentry.captureMessage(`Alta tasa de errores: ${count} en el último minuto`, {
          level: 'fatal',
          tags: {
            alert_type: 'high_error_rate',
          },
        });
      },
    },
    // Alerta para errores críticos específicos
    criticalErrors: {
      patterns: [
        'Database connection failed',
        'Authentication service unavailable',
        'Payment processing error',
      ],
      action: (error: Error) => {
        Sentry.captureException(error, {
          level: 'fatal',
          tags: {
            alert_type: 'critical_error',
          },
        });
      },
    },
  },

  // Alertas de performance
  performance: {
    // Alerta si el tiempo de respuesta es alto
    slowResponses: {
      threshold: 1000, // 1 segundo
      action: (duration: number, endpoint: string) => {
        Sentry.captureMessage(`Respuesta lenta en ${endpoint}: ${duration}ms`, {
          level: 'warning',
          tags: {
            alert_type: 'slow_response',
            endpoint,
          },
        });
      },
    },
    // Alerta si hay muchas peticiones en cola
    highQueueSize: {
      threshold: 100,
      action: (size: number) => {
        Sentry.captureMessage(`Cola de peticiones grande: ${size}`, {
          level: 'warning',
          tags: {
            alert_type: 'high_queue_size',
          },
        });
      },
    },
  },

  // Alertas de seguridad
  security: {
    // Alerta para intentos de autenticación fallidos
    failedLogins: {
      threshold: 5,
      timeWindow: 300, // 5 minutos
      action: (attempts: number, ip: string) => {
        Sentry.captureMessage(`Múltiples intentos de login fallidos desde ${ip}`, {
          level: 'warning',
          tags: {
            alert_type: 'failed_logins',
            ip,
          },
        });
      },
    },
    // Alerta para actividad sospechosa
    suspiciousActivity: {
      patterns: ['SQL injection attempt', 'XSS attempt', 'CSRF token mismatch'],
      action: (activity: string, details: any) => {
        Sentry.captureMessage(`Actividad sospechosa detectada: ${activity}`, {
          level: 'warning',
          tags: {
            alert_type: 'suspicious_activity',
          },
          extra: details,
        });
      },
    },
  },

  // Alertas de recursos
  resources: {
    // Alerta si el uso de memoria es alto
    highMemoryUsage: {
      threshold: 0.9, // 90%
      action: (usage: number) => {
        Sentry.captureMessage(`Uso de memoria alto: ${usage * 100}%`, {
          level: 'warning',
          tags: {
            alert_type: 'high_memory_usage',
          },
        });
      },
    },
    // Alerta si el CPU está sobrecargado
    highCPUUsage: {
      threshold: 0.8, // 80%
      action: (usage: number) => {
        Sentry.captureMessage(`Uso de CPU alto: ${usage * 100}%`, {
          level: 'warning',
          tags: {
            alert_type: 'high_cpu_usage',
          },
        });
      },
    },
  },
};

/**
 * Función para verificar y enviar alertas basadas en métricas
 * @param metrics - Objeto con métricas a verificar
 */
export function checkAlerts(metrics: any) {
  // Verificar errores
  if (metrics.errors.rate > alertRules.errors.highErrorRate.threshold) {
    alertRules.errors.highErrorRate.action(metrics.errors.rate);
  }

  // Verificar performance
  if (metrics.performance.responseTime > alertRules.performance.slowResponses.threshold) {
    alertRules.performance.slowResponses.action(
      metrics.performance.responseTime,
      metrics.performance.endpoint
    );
  }

  // Verificar seguridad
  if (metrics.security.failedLogins > alertRules.security.failedLogins.threshold) {
    alertRules.security.failedLogins.action(metrics.security.failedLogins, metrics.security.ip);
  }

  // Verificar recursos
  if (metrics.resources.memoryUsage > alertRules.resources.highMemoryUsage.threshold) {
    alertRules.resources.highMemoryUsage.action(metrics.resources.memoryUsage);
  }
}
