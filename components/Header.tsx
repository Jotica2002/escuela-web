'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Logo y Nombre */}
          <Link href={user ? '/' : '/login'} className="flex items-center gap-3 hover:opacity-80 transition">
            <Image
              src="/logo-epe.png"
              alt="EPE Logo"
              width={50}
              height={50}
              className="h-12 w-12"
            />
            <div>
              <h1 className="text-lg font-bold text-blue-900">EPE</h1>
              <p className="text-xs text-gray-600">Antonio Patricio de Alcalá</p>
            </div>
          </Link>

          {/* Botón Logout */}
          {user && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {user.nombre}
              </span>
              <Button
                onClick={logout}
                variant="outline"
                size="sm"
              >
                Cerrar sesión
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
