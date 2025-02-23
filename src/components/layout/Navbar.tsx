import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              Logo
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/exercises" className="nav-link">
                Ejercicios
              </Link>
              <Link href="/workouts" className="nav-link">
                Rutinas
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            {user ? (
              <div className="relative">
                <button className="user-menu-button">{user.email}</button>
              </div>
            ) : (
              <Link href="/login" className="nav-link">
                Iniciar sesión
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
