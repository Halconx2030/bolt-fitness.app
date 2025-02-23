'use client';

import { Users, Settings, Shield, BarChart, FileText, Bell, Award } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const menuItems = [
  {
    title: 'Dashboard',
    icon: BarChart,
    href: '/admin/dashboard',
  },
  {
    title: 'Usuarios',
    icon: Users,
    href: '/admin/users',
  },
  {
    title: 'Moderación',
    icon: Shield,
    href: '/admin/moderation',
  },
  {
    title: 'Reportes',
    icon: FileText,
    href: '/admin/reports',
  },
  {
    title: 'Logros',
    icon: Award,
    href: '/admin/achievements',
  },
  {
    title: 'Notificaciones',
    icon: Bell,
    href: '/admin/notifications',
  },
  {
    title: 'Configuración',
    icon: Settings,
    href: '/admin/settings',
  },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-gray-800/50 backdrop-blur-sm h-screen p-4">
      <div className="space-y-2">
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                ${
                  isActive
                    ? 'bg-yellow-400/10 text-yellow-400'
                    : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-100'
                }
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
