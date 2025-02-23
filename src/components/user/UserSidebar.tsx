'use client';

import { 
  Home, Dumbbell, Trophy, Calendar,
  Users, Heart, Settings 
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface UserSidebarProps {
  level: string;
}

const menuItems = [
  {
    title: 'Inicio',
    icon: Home,
    href: '/dashboard'
  },
  {
    title: 'Ejercicios',
    icon: Dumbbell,
    href: '/exercises'
  },
  {
    title: 'Logros',
    icon: Trophy,
    href: '/achievements'
  },
  {
    title: 'Calendario',
    icon: Calendar,
    href: '/calendar'
  },
  {
    title: 'Comunidad',
    icon: Users,
    href: '/community'
  },
  {
    title: 'Favoritos',
    icon: Heart,
    href: '/favorites'
  },
  {
    title: 'Configuración',
    icon: Settings,
    href: '/settings'
  }
];

export const UserSidebar = ({ level }: UserSidebarProps) => {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-gray-800/50 backdrop-blur-sm h-screen p-4">
      <div className="mb-6">
        <div className="p-4 bg-yellow-400/10 rounded-lg">
          <h3 className="text-yellow-400 font-medium">Nivel: {level}</h3>
          <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-yellow-400 rounded-full"
              style={{ width: '60%' }}
            />
          </div>
          <p className="mt-1 text-xs text-gray-400">60% para el siguiente nivel</p>
        </div>
      </div>

      <div className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                ${isActive 
                  ? 'bg-yellow-400/10 text-yellow-400' 
                  : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-100'}
              `}
            >
              <Icon className="w-5 h-5" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}; 