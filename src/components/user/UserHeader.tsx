'use client';

import { Bell, User, Trophy, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface UserHeaderProps {
  user: any;
  level: string;
}

export const UserHeader = ({ user, level }: UserHeaderProps) => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-yellow-400">BOLT FITNESS</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="search"
              placeholder="Buscar ejercicios..."
              className="pl-10 bg-gray-700/50 border-gray-600 focus:border-yellow-400"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-3 py-1 bg-yellow-400/10 rounded-full">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 font-medium">{level}</span>
          </div>

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5 text-gray-400" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-yellow-400 rounded-full" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>{user?.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>Mi Perfil</DropdownMenuItem>
              <DropdownMenuItem>Mis Logros</DropdownMenuItem>
              <DropdownMenuItem>Progreso</DropdownMenuItem>
              <DropdownMenuItem>Configuración</DropdownMenuItem>
              <DropdownMenuItem className="text-red-400">Cerrar Sesión</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
