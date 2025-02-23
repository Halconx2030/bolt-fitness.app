import MainLayout from '@/components/layouts/MainLayout';
import { motion } from 'framer-motion';
import { User, Mail, Calendar } from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';

export default function Profile() {
  const { user } = useAuthContext();

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="rounded-2xl bg-secondary p-8">
          <div className="flex items-center space-x-6">
            <div className="h-24 w-24 rounded-full bg-primary p-2">
              <User className="h-full w-full text-background" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{user?.email}</h1>
              <p className="text-gray-400">Usuario</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-2xl bg-secondary p-6"
          >
            <h2 className="text-xl font-bold text-white">Información Personal</h2>
            <div className="mt-4 space-y-4">
              <div className="flex items-center space-x-3 text-gray-400">
                <Mail className="h-5 w-5" />
                <span>{user?.email}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Calendar className="h-5 w-5" />
                <span>Miembro desde: Enero 2024</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-2xl bg-secondary p-6"
          >
            <h2 className="text-xl font-bold text-white">Estadísticas</h2>
            <div className="mt-4 space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Rutinas Completadas</span>
                <span className="font-bold text-primary">24</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Días Activos</span>
                <span className="font-bold text-primary">45</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </MainLayout>
  );
}
