'use client';

import { Card } from '@/components/ui/card';
import { 
  LineChart, 
  BarChart, 
  Line, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';

interface StatsPanelProps {
  data: {
    daily: any[];
    weekly: any[];
    achievements: any[];
  };
}

export const StatsPanel = ({ data }: StatsPanelProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Progreso Diario</h3>
        <LineChart width={400} height={200} data={data.daily}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="points" stroke="#EAB308" />
        </LineChart>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Ejercicios por Semana</h3>
        <BarChart width={400} height={200} data={data.weekly}>
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="exercises" fill="#EAB308" />
        </BarChart>
      </Card>

      <Card className="p-6 md:col-span-2">
        <h3 className="text-lg font-semibold mb-4">Logros Desbloqueados</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {data.achievements.map((achievement) => (
            <div 
              key={achievement.id}
              className="flex items-center space-x-2 p-3 rounded-lg bg-yellow-400/10"
            >
              <achievement.icon className="w-6 h-6 text-yellow-400" />
              <span className="text-sm font-medium">{achievement.name}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}; 