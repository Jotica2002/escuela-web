'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (isAuthenticated && user) {
      if (user.rol === 'student') {
        router.push('/student');
      } else if (user.rol === 'teacher' || user.rol === 'profesor') {
        router.push('/teacher');
      } else if (user.rol === 'admin') {
        router.push('/admin');
      } else if (user.rol === 'convenio') {
        router.push('/convenio');
      } else {
        router.push('/login');
      }
    } else {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Skeleton className="h-12 w-48" />
    </div>
  );
}
