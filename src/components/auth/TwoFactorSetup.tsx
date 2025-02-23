import { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import { TwoFactorService } from '@/lib/auth/twoFactor';

interface TwoFactorSetupProps {
  userId: string;
  onComplete: () => void;
}

/**
 * Componente para la configuración de autenticación de dos factores
 * Incluye feedback visual y animaciones para mejorar la UX
 */
export const TwoFactorSetup = ({ userId, onComplete }: TwoFactorSetupProps) => {
  const [step, setStep] = useState<'qr' | 'verify' | 'backup'>('qr');
  const [secret, setSecret] = useState('');
  const [otpauthUrl, setOtpauthUrl] = useState('');
  const [token, setToken] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Generar secreto al montar el componente
  useEffect(() => {
    const generateSecret = async () => {
      try {
        const { secret, otpauthUrl } = await TwoFactorService.generateSecret(userId);
        setSecret(secret);
        setOtpauthUrl(otpauthUrl);
      } catch (err) {
        setError('Error al generar el código QR');
      }
    };
    generateSecret();
  }, [userId]);

  // Verificar token ingresado
  const handleVerify = async () => {
    setIsLoading(true);
    setError('');

    try {
      const isValid = await TwoFactorService.verifyToken(userId, token);
      if (isValid) {
        const codes = await TwoFactorService.generateBackupCodes(userId);
        setBackupCodes(codes);
        setStep('backup');
      } else {
        setError('Código inválido. Inténtalo de nuevo.');
      }
    } catch (err) {
      setError('Error al verificar el código');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <AnimatePresence mode="wait">
        {step === 'qr' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-gray-800">
              Configura la autenticación de dos factores
            </h2>
            <div className="flex justify-center">
              <QRCode value={otpauthUrl} size={200} />
            </div>
            <p className="text-sm text-gray-600">
              Escanea el código QR con tu aplicación de autenticación
            </p>
            <button
              onClick={() => setStep('verify')}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Continuar
            </button>
          </motion.div>
        )}

        {step === 'verify' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-gray-800">Verifica tu código</h2>
            <div className="space-y-4">
              <input
                type="text"
                value={token}
                onChange={e => setToken(e.target.value)}
                placeholder="Ingresa el código de 6 dígitos"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                maxLength={6}
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                onClick={handleVerify}
                disabled={isLoading || token.length !== 6}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                {isLoading ? 'Verificando...' : 'Verificar'}
              </button>
            </div>
          </motion.div>
        )}

        {step === 'backup' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-gray-800">Guarda tus códigos de respaldo</h2>
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-2">
                {backupCodes.map((code, index) => (
                  <div key={index} className="font-mono text-sm">
                    {code}
                  </div>
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Guarda estos códigos en un lugar seguro. Los necesitarás si pierdes acceso a tu
              dispositivo.
            </p>
            <button
              onClick={onComplete}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
            >
              Finalizar configuración
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
