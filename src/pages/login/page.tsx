'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { assets } from '@/config/assets';

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Aquí irá la lógica de autenticación
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulación de validación
      if (!formData.email || !formData.password) {
        throw new Error('Por favor completa todos los campos');
      }

      // Aquí iría la llamada a tu API
      console.log('Iniciando sesión...', formData);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al iniciar sesión',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex justify-center items-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <Card className="backdrop-blur-xl bg-gray-800/50 border-gray-700">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <motion.div
                    animate={{
                      boxShadow: ['0 0 20px #EAB308', '0 0 60px #EAB308', '0 0 20px #EAB308'],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: 'reverse',
                    }}
                    className="absolute inset-0 rounded-2xl"
                  />
                  <img
                    src={assets.images.logo.src}
                    alt={assets.images.logo.alt}
                    className="relative w-full h-full object-contain logo-glow"
                  />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 bg-clip-text text-transparent">
                  BOLT FITNESS
                </h2>
                <p className="text-gray-400 mt-2">Potencia tu entrenamiento</p>
              </motion.div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="Correo Electrónico"
                    className="pl-10 bg-gray-700/50 border-gray-600 text-gray-100 placeholder:text-gray-400"
                    value={formData.email}
                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    disabled={isLoading}
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type="password"
                    placeholder="Contraseña"
                    className="pl-10 bg-gray-700/50 border-gray-600 text-gray-100 placeholder:text-gray-400"
                    value={formData.password}
                    onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    disabled={isLoading}
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
              >
                <Button
                  type="submit"
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </Button>
              </motion.div>
            </form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.7 }}
              className="mt-6 text-center space-y-2"
            >
              <a href="#" className="text-sm text-gray-400 hover:text-yellow-400 transition">
                ¿Olvidaste tu contraseña?
              </a>
              <p className="text-gray-400">
                ¿No tienes cuenta?{' '}
                <a href="/registro" className="text-yellow-400 hover:text-yellow-300 transition">
                  Regístrate
                </a>
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;
