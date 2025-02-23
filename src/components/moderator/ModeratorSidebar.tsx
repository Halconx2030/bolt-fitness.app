'use client';

import { 
  Shield, AlertTriangle, MessageSquare, 
  Users, History, Settings 
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const menuItems = [
  {
    title: 'Reportes Activos',
    icon: AlertTriangle,
    href: '/moderator/reports',
    badge: '5'
  },
  {
    title: 'Comentarios',
    icon: MessageSquare,
    href: '/moderator/comments'
  },
  {
    title: 'Usuarios',
    icon: Users,
    href: '/moderator/users'
  },
  {
    title: 'Historial',
    icon: History,
    href: '/moderator/history'
  },
  {
    title: 'Guías',
    icon: Shield,
    href: '/moderator/guidelines'
  },
  {
    title: 'Configuración',
    icon: Settings,
    href: '/moderator/settings'
  }
];

export const ModeratorSidebar = () => {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-gray-800/50 backdrop-blur-sm h-screen p-4">
      <div className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center justify-between px-4 py-3 rounded-lg transition-colors
                ${isActive 
                  ? 'bg-yellow-400/10 text-yellow-400' 
                  : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-100'}
              `}
            >
              <div className="flex items-center space-x-3">
                <Icon className="w-5 h-5" />
                <span>{item.title}</span>
              </div>
              {item.badge && (
                <span className="px-2 py-1 text-xs bg-red-400/20 text-red-400 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}; 