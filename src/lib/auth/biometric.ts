import { logger } from '@/lib/monitoring/logger';

/**
 * Servicio de autenticación biométrica
 * Utiliza la Web Authentication API (WebAuthn)
 */
export class BiometricService {
  private static readonly AUTH_NAME = 'BoltFitness';
  private static readonly KEY_NAME = 'biometric_key';

  /**
   * Verifica si el dispositivo soporta autenticación biométrica
   */
  static async isSupported(): Promise<boolean> {
    try {
      return (
        window.PublicKeyCredential &&
        (await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable())
      );
    } catch (error) {
      logger.error('Error al verificar soporte biométrico:', error);
      return false;
    }
  }

  /**
   * Registra las credenciales biométricas del usuario
   */
  static async register(userId: string, username: string): Promise<boolean> {
    try {
      // Generar challenge aleatorio
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);

      // Crear opciones de registro
      const createCredentialOptions: CredentialCreationOptions = {
        publicKey: {
          challenge,
          rp: {
            name: this.AUTH_NAME,
            id: window.location.hostname,
          },
          user: {
            id: Uint8Array.from(userId, c => c.charCodeAt(0)),
            name: username,
            displayName: username,
          },
          pubKeyCredParams: [
            { type: 'public-key', alg: -7 }, // ES256
            { type: 'public-key', alg: -257 }, // RS256
          ],
          authenticatorSelection: {
            authenticatorAttachment: 'platform',
            userVerification: 'required',
            requireResidentKey: false,
          },
          timeout: 60000,
          attestation: 'none',
        },
      };

      // Crear credencial
      const credential = await navigator.credentials.create(createCredentialOptions);

      if (!credential) {
        throw new Error('No se pudo crear la credencial biométrica');
      }

      // Guardar credencial en el servidor
      await fetch('/api/auth/biometric/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          credential,
        }),
      });

      logger.info({
        event: 'biometric_registration_success',
        userId,
      });

      return true;
    } catch (error) {
      logger.error('Error al registrar credencial biométrica:', error);
      return false;
    }
  }

  /**
   * Autentica al usuario usando biometría
   */
  static async authenticate(userId: string): Promise<boolean> {
    try {
      // Obtener challenge del servidor
      const response = await fetch('/api/auth/biometric/challenge');
      const { challenge } = await response.json();

      // Crear opciones de autenticación
      const getCredentialOptions: CredentialRequestOptions = {
        publicKey: {
          challenge: Uint8Array.from(challenge, c => c.charCodeAt(0)),
          rpId: window.location.hostname,
          userVerification: 'required',
          timeout: 60000,
        },
      };

      // Obtener credencial
      const assertion = await navigator.credentials.get(getCredentialOptions);

      if (!assertion) {
        throw new Error('No se pudo obtener la credencial biométrica');
      }

      // Verificar credencial en el servidor
      const verifyResponse = await fetch('/api/auth/biometric/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          assertion,
        }),
      });

      if (!verifyResponse.ok) {
        throw new Error('Error al verificar credencial biométrica');
      }

      logger.info({
        event: 'biometric_authentication_success',
        userId,
      });

      return true;
    } catch (error) {
      logger.error('Error en autenticación biométrica:', error);
      return false;
    }
  }

  /**
   * Elimina las credenciales biométricas del usuario
   */
  static async deregister(userId: string): Promise<boolean> {
    try {
      const response = await fetch('/api/auth/biometric/deregister', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error('Error al eliminar credencial biométrica');
      }

      logger.info({
        event: 'biometric_deregistration_success',
        userId,
      });

      return true;
    } catch (error) {
      logger.error('Error al eliminar credencial biométrica:', error);
      return false;
    }
  }
}
