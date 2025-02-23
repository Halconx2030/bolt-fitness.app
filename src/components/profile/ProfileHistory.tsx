'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dumbbell, Calendar, Trophy, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export function ProfileHistory() {
  const [currentTab, setCurrentTab] = useState('exercises');

  return (
    <Card className="p-6">
      <Tabs defaultValue="exercises" onValueChange={setCurrentTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="exercises" className="space-x-2">
            <Dumbbell className="w-4 h-4" />
            <span>Ejercicios</span>
          </TabsTrigger>
          <TabsTrigger value="achievements" className="space-x-2">
            <Trophy className="w-4 h-4" />
            <span>Logros</span>
          </TabsTrigger>
          <TabsTrigger value="comments" className="space-x-2">
            <MessageSquare className="w-4 h-4" />
            <span>Comentarios</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="exercises">
          <ScrollArea className="h-[400px]">
            <ExerciseHistory />
          </ScrollArea>
        </TabsContent>

        <TabsContent value="achievements">
          <ScrollArea className="h-[400px]">
            <AchievementHistory />
          </ScrollArea>
        </TabsContent>

        <TabsContent value="comments">
          <ScrollArea className="h-[400px]">
            <CommentHistory />
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </Card>
  );
}

function ExerciseHistory() {
  return (
    <div className="space-y-4">
      {/* Ejemplo de datos, reemplazar con datos reales */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-start space-x-4 p-4 rounded-lg bg-gray-800/50"
        >
          <div className="p-2 bg-yellow-400/10 rounded-lg">
            <Dumbbell className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Ejercicio de Fuerza</h4>
              <span className="text-sm text-gray-400">
                {formatDistanceToNow(new Date(Date.now() - i * 86400000), {
                  addSuffix: true,
                  locale: es
                })}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">
              Completado con 100 puntos
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function AchievementHistory() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="flex items-start space-x-4 p-4 rounded-lg bg-gray-800/50"
        >
          <div className="p-2 bg-yellow-400/10 rounded-lg">
            <Trophy className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Logro Desbloqueado</h4>
              <span className="text-sm text-gray-400">
                {formatDistanceToNow(new Date(Date.now() - i * 86400000), {
                  addSuffix: true,
                  locale: es
                })}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">
              ¡Has alcanzado un nuevo nivel!
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function CommentHistory() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="flex items-start space-x-4 p-4 rounded-lg bg-gray-800/50"
        >
          <div className="p-2 bg-yellow-400/10 rounded-lg">
            <MessageSquare className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Comentario en Ejercicio</h4>
              <span className="text-sm text-gray-400">
                {formatDistanceToNow(new Date(Date.now() - i * 86400000), {
                  addSuffix: true,
                  locale: es
                })}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">
              "¡Excelente ejercicio! Me ayudó mucho."
            </p>
          </div>
        </div>
      ))}
    </div>
  );
} 