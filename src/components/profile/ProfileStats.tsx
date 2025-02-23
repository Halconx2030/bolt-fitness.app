'use client';

import { Card } from '@/components/ui/card';
import { Trophy, Dumbbell, Flame, Star } from 'lucide-react';
import { useStats } from '@/hooks/useStats';

export function ProfileStats() {
  const { dailyStats, weeklyStats } = useStats();

  const stats = [
    {
      label: 'Ejercicios Completados',
      value: '156',
      icon: Dumbbell,
      change: '+12% vs. mes anterior'
    },
    {
      label: 'Racha Actual',
      value: '7 días',
      icon: Flame,
      change: 'Mejor racha: 15 días'
    },
    {
      label: 'Puntos Totales',
      value: '2,450',
      icon: Star,
      change: '+350 esta semana'
    },
    {
      label: 'Logros Desbloqueados',
      value: '24/50',
      icon: Trophy,
      change: '3 nuevos esta semana'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-400">{stat.label}</p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
              <p className="text-sm text-gray-400 mt-1">{stat.change}</p>
            </div>
            <div className="p-3 bg-yellow-400/10 rounded-lg">
              <stat.icon className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
} 