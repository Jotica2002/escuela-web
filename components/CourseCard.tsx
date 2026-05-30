'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';
import { api, MEDIA_URL } from '@/lib/api';
import { BookOpen, X, CheckCircle2 } from 'lucide-react';

interface CourseCardProps {
  id: string;
  nombre: string;
  descripcion?: string;
  imagen_url?: string;
  onInscribe?: () => void;
}

export function CourseCard({ id, nombre, descripcion, imagen_url, onInscribe }: CourseCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleInscribe = async () => {
    setIsLoading(true);
    setShowConfirm(false);
    try {
      await api.enrollCourse({ curso_id: id });
      toast.success(`¡Te inscribiste en "${nombre}" exitosamente!`);
      onInscribe?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al inscribirse');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Modal de confirmación */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                <BookOpen size={22} className="text-[#1e3a8a]" />
              </div>
              <button
                onClick={() => setShowConfirm(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors mt-0.5"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Confirmar Inscripción</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                ¿Estás seguro de que deseas inscribirte en el curso{' '}
                <span className="font-semibold text-[#1e3a8a]">"{nombre}"</span>?
              </p>
            </div>

            {/* Imagen previa si existe */}
            {imagen_url && (
              <div className="rounded-xl overflow-hidden h-28 w-full">
                <img
                  src={`${MEDIA_URL}/uploads/${imagen_url}`}
                  alt={nombre}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowConfirm(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                className="flex-1 bg-[#1e3a8a] hover:bg-[#152960] text-white flex items-center justify-center gap-2"
                onClick={handleInscribe}
                disabled={isLoading}
              >
                <CheckCircle2 size={16} />
                {isLoading ? 'Inscribiendo...' : 'Confirmar'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Card del curso */}
      <Card className="h-full bg-white shadow-md border border-gray-100 rounded-xl hover:shadow-lg transition-shadow duration-300 flex flex-col overflow-hidden">
        {imagen_url ? (
          <div className="h-48 w-full shrink-0 overflow-hidden">
            <img
              src={`${MEDIA_URL}/uploads/${imagen_url}`}
              alt={nombre}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        ) : (
          <div className="h-48 w-full shrink-0 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center border-b border-gray-100">
            <BookOpen size={48} className="text-[#1e3a8a]/30" />
          </div>
        )}
        <div className="flex flex-col flex-1">
          <CardHeader className="p-6 pb-3">
            <CardTitle className="text-xl font-bold text-[#1e3a8a] line-clamp-2">{nombre}</CardTitle>
            {descripcion && (
              <CardDescription className="text-gray-500 mt-2 line-clamp-3">{descripcion}</CardDescription>
            )}
          </CardHeader>
          <CardContent className="px-6 pb-6 mt-auto">
            <Button
              onClick={() => setShowConfirm(true)}
              disabled={isLoading}
              className="w-full bg-[#f97316] hover:bg-[#ea580c] text-white font-medium rounded-lg h-11 transition-all"
            >
              {isLoading ? 'Inscribiendo...' : 'Inscribirse'}
            </Button>
          </CardContent>
        </div>
      </Card>
    </>
  );
}
