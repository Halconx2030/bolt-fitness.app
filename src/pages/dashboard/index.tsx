import { useAuthContext } from '@/contexts/AuthContext';
import MainLayout from '@/components/layouts/MainLayout';
import { motion } from 'framer-motion';
import { Activity, TrendingUp, Users, Calendar } from 'lucide-react';

const statsItems = [
  {
    title: 'Actividades',
    value: '24',
    icon: Activity,
    color: 'bg-blue-500',
  },
  {
    title: 'Progreso',
    value: '85%',
    icon: TrendingUp,
    color: 'bg-green-500',
  },
  {
    title: 'Amigos',
    value: '12',
    icon: Users,
    color: 'bg-purple-500',
  },
  {
    title: 'Días Activo',
    value: '45',
    icon: Calendar,
    color: 'bg-orange-500',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Dashboard() {
  const { user } = useAuthContext();

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-white">
            Bienvenido, <span className="text-primary">{user?.email}</span>
          </h1>
          <p className="mt-2 text-gray-400">Aquí está el resumen de tu actividad</p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {statsItems.map(stat => (
            <motion.div key={stat.title} variants={item} className="rounded-2xl bg-secondary p-6">
              <div className="flex items-center space-x-4">
                <div className={`rounded-xl ${stat.color} p-3`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="rounded-2xl bg-secondary p-6">
          <h2 className="text-2xl font-bold text-white">Actividad Reciente</h2>
          <p className="mt-2 text-gray-400">Próximamente: Gráficos y estadísticas detalladas</p>
        </div>
      </div>
    </MainLayout>
  );
}
