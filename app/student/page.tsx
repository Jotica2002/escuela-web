'use client';

import { useState, useEffect } from 'react';
import { ChatbotFAQ } from '@/components/ChatbotFAQ';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface StudentProfile {
  nombre: string;
  email: string;
  cursosInscritos: number;
}

export default function StudentDashboard() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      try {
        if (user) {
          setProfile({
            nombre: user.nombre,
            email: user.email,
            cursosInscritos: 0,
          });
        }
      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadData();
  }, [user]);

  return (
    <>
      <main className="max-w-7xl mx-auto px-6 py-8">
        <section className="mb-10 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-20 h-20 bg-[#1e3a8a] rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-lg overflow-hidden border-4 border-white">
            {user?.foto_perfil ? (
              <img
                src={`http://127.0.0.1:5000${user.foto_perfil}`}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl font-bold">
                {user?.nombre?.charAt(0).toUpperCase() || 'S'}
              </span>
            )}
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-3xl lg:text-4xl font-extrabold text-[#1e3a8a] mb-2 tracking-tight">
              Bienvenido(a), {user?.nombre || 'Estudiante'}
            </h1>
            <p className="text-gray-500 text-lg">Aquí tienes el resumen de tu cuenta y los cursos de emprendimiento disponibles.</p>
          </div>
        </section>

        {/* Estadísticas */}
        {isLoadingProfile ? (
          <div className="grid gap-4 md:grid-cols-3 mb-8">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3 mb-12">
            <Card className="bg-white shadow-md border border-gray-100 rounded-xl hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-2 pt-6 px-6">
                <CardTitle className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  Tu Nombre
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="text-2xl font-bold text-[#1e3a8a]">{profile?.nombre}</div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-md border border-gray-100 rounded-xl hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-2 pt-6 px-6">
                <CardTitle className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  Correo Electrónico
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="text-lg font-bold text-[#1e3a8a] truncate">
                  {profile?.email}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-md border border-gray-100 rounded-xl hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-2 pt-6 px-6">
                <CardTitle className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  Cursos Inscritos
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="text-4xl font-extrabold text-orange-500">
                  {profile?.cursosInscritos || 0}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
      <ChatbotFAQ />
    </>
  );
}
