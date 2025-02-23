import { authenticator } from '@otplib/preset-default';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { Redis } from '@upstash/redis';
import { sendEmail } from '@/lib/email';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

/**
 * Servicio de autenticación de dos factores (2FA)
 * Implementa TOTP (Time-based One-Time Password) según RFC 6238
 */
export class TwoFactorService {
  private static readonly TWO_FACTOR_SECRET_PREFIX = '2fa_secret:';
  private static readonly BACKUP_CODES_PREFIX = '2fa_backup:';
  private static readonly RECOVERY_TOKEN_PREFIX = '2fa_recovery:';

  /**
   * Genera un nuevo secreto TOTP para un usuario
   * @param userId - ID del usuario
   * @returns Objeto con el secreto y el QR code URL
   */
  static async generateSecret(userId: string) {
    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(userId, 'BoltFitness', secret);

    // Almacenar el secreto temporalmente
    await redis.set(
      `${this.TWO_FACTOR_SECRET_PREFIX}${userId}`,
      secret,
      { ex: 3600 } // Expira en 1 hora
    );

    return {
      secret,
      otpauthUrl,
    };
  }

  /**
   * Verifica un código TOTP
   * @param userId - ID del usuario
   * @param token - Código TOTP a verificar
   */
  static async verifyToken(userId: string, token: string): Promise<boolean> {
    const secret = await redis.get(`${this.TWO_FACTOR_SECRET_PREFIX}${userId}`);
    if (!secret) return false;

    return authenticator.verify({ token, secret });
  }

  /**
   * Genera códigos de respaldo para un usuario
   * @param userId - ID del usuario
   * @returns Array de códigos de respaldo
   */
  static async generateBackupCodes(userId: string): Promise<string[]> {
    const codes = Array.from({ length: 10 }, () => Math.random().toString(36).substr(2, 8));

    await redis.set(
      `${this.BACKUP_CODES_PREFIX}${userId}`,
      JSON.stringify(codes),
      { ex: 365 * 24 * 60 * 60 } // Expira en 1 año
    );

    return codes;
  }

  /**
   * Inicia el proceso de recuperación de cuenta
   * @param email - Email del usuario
   */
  static async initiateAccountRecovery(email: string) {
    const supabase = createServerComponentClient();

    // Verificar que el email existe
    const { data: user } = await supabase.from('users').select('id').eq('email', email).single();

    if (!user) throw new Error('Usuario no encontrado');

    // Generar token de recuperación
    const recoveryToken = Math.random().toString(36).substr(2);
    await redis.set(
      `${this.RECOVERY_TOKEN_PREFIX}${user.id}`,
      recoveryToken,
      { ex: 3600 } // Expira en 1 hora
    );

    // Enviar email de recuperación
    await sendEmail({
      to: email,
      subject: 'Recuperación de cuenta BoltFitness',
      template: 'account-recovery',
      data: {
        recoveryLink: `${process.env.NEXT_PUBLIC_APP_URL}/recovery?token=${recoveryToken}`,
      },
    });
  }

  /**
   * Verifica un token de recuperación
   * @param userId - ID del usuario
   * @param token - Token de recuperación
   */
  static async verifyRecoveryToken(userId: string, token: string): Promise<boolean> {
    const storedToken = await redis.get(`${this.RECOVERY_TOKEN_PREFIX}${userId}`);
    return token === storedToken;
  }

  /**
   * Deshabilita 2FA para un usuario
   * @param userId - ID del usuario
   */
  static async disable2FA(userId: string) {
    const supabase = createServerComponentClient();

    await Promise.all([
      redis.del(`${this.TWO_FACTOR_SECRET_PREFIX}${userId}`),
      redis.del(`${this.BACKUP_CODES_PREFIX}${userId}`),
      supabase.from('users').update({ two_factor_enabled: false }).eq('id', userId),
    ]);
  }
}
