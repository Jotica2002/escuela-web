'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api';
import { BookOpen, CheckCircle, FileSignature } from 'lucide-react';

interface Stats {
  total: number;
  pendientes: number;
  aprobadas: number;
}

export default function TeacherHomePage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        // Temporary stub since getEstadisticas might not return exactly {total, pendientes, aprobadas} yet
        const data = await api.getEstadisticas().catch(() => ({ total: 0, pendientes: 0, aprobadas: 0 }));
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      <header className="mb-10">
        <h1 className="text-3xl lg:text-4xl font-extrabold text-[#1e3a8a] mb-2 tracking-tight">
          ¡Bienvenido, Profesor {user?.nombre?.split(' ')[0] || ''}!
        </h1>
        <p className="text-gray-500 text-lg">
          Este es tu panel de control. Desde aquí puedes gestionar tus cursos y propuestas académicas.
        </p>
      </header>

      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          Resumen de Actividad
        </h2>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-3">
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-300 border-none rounded-xl overflow-hidden group py-6">
              <CardContent className="flex items-center gap-6 p-6">
                <div className="p-4 bg-blue-50 text-[#1e3a8a] rounded-2xl group-hover:scale-110 transition-transform flex-shrink-0">
                  <BookOpen size={32} />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Propuestas</p>
                  <p className="text-4xl font-extrabold text-gray-900">{stats?.total || 0}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-300 border-none rounded-xl overflow-hidden group py-6">
              <CardContent className="flex items-center gap-6 p-6">
                <div className="p-4 bg-orange-50 text-[#f97316] rounded-2xl group-hover:scale-110 transition-transform flex-shrink-0">
                  <FileSignature size={32} />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">En Revisión</p>
                  <p className="text-4xl font-extrabold text-gray-900">{stats?.pendientes || 0}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-300 border-none rounded-xl overflow-hidden group py-6">
              <CardContent className="flex items-center gap-6 p-6">
                <div className="p-4 bg-green-50 text-green-600 rounded-2xl group-hover:scale-110 transition-transform flex-shrink-0">
                  <CheckCircle size={32} />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Aprobadas</p>
                  <p className="text-4xl font-extrabold text-gray-900">{stats?.aprobadas || 0}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </section>
    </main>
  );
}
