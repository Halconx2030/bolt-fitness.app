'use client';

import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trophy } from 'lucide-react';
import { useStats } from '@/hooks/useStats';

export function ProfileAchievements() {
  const { achievements } = useStats();

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Logros</h3>
      <ScrollArea className="h-[600px] pr-4">
        <div className="space-y-4">
          {achievements.map(achievement => (
            <div
              key={achievement.id}
              className="flex items-start space-x-4 p-3 rounded-lg bg-gray-800/50"
            >
              <div className="p-2 bg-yellow-400/10 rounded-lg">
                <Trophy className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="font-medium">{achievement.nombre}</p>
                <p className="text-sm text-gray-400 mt-1">{achievement.descripcion}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <div className="text-xs px-2 py-1 bg-yellow-400/10 text-yellow-400 rounded-full">
                    {achievement.puntos_requeridos} pts
                  </div>
                  <p className="text-xs text-gray-500">
                    Desbloqueado el {new Date(achievement.fecha_obtencion).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}
