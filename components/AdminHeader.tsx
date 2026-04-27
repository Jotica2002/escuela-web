'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { LogOut, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function AdminHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="bg-white border-b-2 border-red-600 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-3 hover:opacity-80 transition">
          <Image
            src="/logo-epe.png"
            alt="EPE Logo"
            width={48}
            height={48}
            className="h-12 w-12"
          />
          <div>
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-red-600" />
              <h1 className="text-lg font-bold text-red-600">Admin</h1>
            </div>
            <p className="text-xs text-gray-600">Panel de administración</p>
          </div>
        </Link>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-semibold text-gray-800">{user?.nombre}</p>
            <p className="text-xs text-gray-600">{user?.email}</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="text-red-600 border-red-600 hover:bg-red-50 bg-transparent"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </header>
  );
}
