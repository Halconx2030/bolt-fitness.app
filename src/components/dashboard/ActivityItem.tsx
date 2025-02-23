'use client';

import { Trophy, Dumbbell, Star, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface ActivityItemProps {
  activity: {
    id: number;
    tipo_actividad: string;
    detalles: any;
    fecha_actividad: string;
    usuario: {
      nombre: string;
    };
  };
}

const activityIcons = {
  logro: Trophy,
  ejercicio: Dumbbell,
  nivel: Star,
  comentario: MessageSquare,
};

export function ActivityItem({ activity }: ActivityItemProps) {
  const Icon = activityIcons[activity.tipo_actividad as keyof typeof activityIcons];
  
  return (
    <div className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-800/50 transition">
      <div className="p-2 bg-yellow-400/10 rounded-lg">
        <Icon className="w-5 h-5 text-yellow-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-200">
          {activity.usuario.nombre}
        </p>
        <p className="text-sm text-gray-400">
          {getActivityMessage(activity)}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {formatDistanceToNow(new Date(activity.fecha_actividad), {
            addSuffix: true,
            locale: es
          })}
        </p>
      </div>
    </div>
  );
}

function getActivityMessage(activity: ActivityItemProps['activity']) {
  switch (activity.tipo_actividad) {
    case 'logro':
      return `Desbloqueó el logro "${activity.detalles.nombre}"`;
    case 'ejercicio':
      return `Completó el ejercicio "${activity.detalles.nombre}"`;
    case 'nivel':
      return `Alcanzó el nivel ${activity.detalles.nivel}`;
    case 'comentario':
      return `Comentó en "${activity.detalles.ejercicio}"`;
    default:
      return 'Realizó una actividad';
  }
} 