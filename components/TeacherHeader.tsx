'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { LogOut, User } from 'lucide-react';

export function TeacherHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="bg-white border-b-2 border-orange-500 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/teacher" className="flex items-center gap-3 hover:opacity-80 transition">
          <Image
            src="/logo-epe.png"
            alt="EPE Logo"
            width={48}
            height={48}
            className="h-12 w-12"
          />
          <div>
            <h1 className="text-lg font-bold text-orange-600">EPE</h1>
            <p className="text-xs text-gray-600">Profesor</p>
          </div>
        </Link>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <User size={20} className="text-orange-600" />
            <span className="text-sm font-medium text-gray-800">{user?.nombre}</span>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="text-orange-600 border-orange-600 hover:bg-orange-50 bg-transparent"
          >
            <LogOut size={16} />
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </header>
  );
}
