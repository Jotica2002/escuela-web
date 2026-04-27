'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';
import { api } from '@/lib/api';

interface CourseCardProps {
  id: string;
  nombre: string;
  descripcion?: string;
  imagen_url?: string;
  onInscribe?: () => void;
}

export function CourseCard({ id, nombre, descripcion, imagen_url, onInscribe }: CourseCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleInscribe = async () => {
    setIsLoading(true);
    try {
      await api.enrollCourse({ curso_id: id });
      toast.success(`¡Te inscribiste en ${nombre}!`);
      onInscribe?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al inscribirse');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-full bg-white shadow-md border border-gray-100 rounded-xl hover:shadow-lg transition-shadow duration-300 flex flex-col overflow-hidden">
      {imagen_url ? (
        <div className="h-48 w-full shrink-0 overflow-hidden">
            <img 
              src={`http://127.0.0.1:5000/uploads/${imagen_url}`} 
              alt={nombre} 
              className="w-full h-full object-cover"
            />
        </div>
      ) : (
        <div className="h-48 w-full shrink-0 bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center justify-center border-b border-gray-100">
            <span className="text-4xl">📚</span>
        </div>
      )}
      <div className="flex flex-col flex-1">
          <CardHeader className="p-6">
            <CardTitle className="text-xl font-bold text-[#1e3a8a] line-clamp-2">{nombre}</CardTitle>
            {descripcion && <CardDescription className="text-gray-500 mt-2 line-clamp-3">{descripcion}</CardDescription>}
          </CardHeader>
          <CardContent className="px-6 pb-6 space-y-4 mt-auto">
            <Button
              onClick={handleInscribe}
              disabled={isLoading}
              className="w-full bg-[#f97316] hover:bg-[#ea580c] text-white font-medium rounded-lg h-11"
            >
              {isLoading ? 'Inscribiendo...' : 'Inscribirse'}
            </Button>
          </CardContent>
      </div>
    </Card>
  );
}
