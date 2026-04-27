'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, X, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Propuesta {
  id: number;
  nombre: string;
  descripcion: string;
  duracion: string;
  requisitos: string;
  estado: 'pendiente' | 'aprobado' | 'rechazado';
  profesor_nombre: string;
  fecha_creacion: string;
}

export function ProposalsManagement() {
  const [propuestas, setPropuestas] = useState<Propuesta[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<'todas' | 'pendiente' | 'aprobado' | 'rechazado'>('todas');

  useEffect(() => {
    cargarPropuestas();
  }, []);

  const cargarPropuestas = async () => {
    try {
      setLoading(true);
      const data = await api.getAdminPropuestas();
      setPropuestas(data);
    } catch (error) {
      toast.error('Error al cargar propuestas');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const aprobar = async (propuestaId: number) => {
    try {
      await api.aprobarPropuesta(String(propuestaId));
      toast.success('Propuesta aprobada correctamente');
      cargarPropuestas();
    } catch (error) {
      toast.error('Error al aprobar propuesta');
    }
  };

  const rechazar = async (propuestaId: number) => {
    try {
      await api.rechazarPropuesta(String(propuestaId));
      toast.success('Propuesta rechazada');
      cargarPropuestas();
    } catch (error) {
      toast.error('Error al rechazar propuesta');
    }
  };

  const propuestasFiltradas = propuestas.filter(
    p => filtro === 'todas' || p.estado === filtro
  );

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>;
      case 'aprobado':
        return <Badge className="bg-green-100 text-green-800">Aprobado</Badge>;
      case 'rechazado':
        return <Badge className="bg-red-100 text-red-800">Rechazado</Badge>;
      default:
        return <Badge>{estado}</Badge>;
    }
  };

  if (loading) {
    return <div className="text-center py-8">Cargando propuestas...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Gestionar Propuestas</h2>
        <div className="flex gap-2 flex-wrap">
          {(['todas', 'pendiente', 'aprobado', 'rechazado'] as const).map(f => (
            <Button
              key={f}
              onClick={() => setFiltro(f)}
              variant={filtro === f ? 'default' : 'outline'}
              className={filtro === f ? 'bg-red-600 hover:bg-red-700' : ''}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {propuestasFiltradas.length === 0 ? (
          <Card className="p-8 text-center text-gray-500">
            No hay propuestas para mostrar
          </Card>
        ) : (
          propuestasFiltradas.map(propuesta => (
            <Card key={propuesta.id} className="p-6 border-l-4 border-l-red-600">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold">{propuesta.nombre}</h3>
                    {getEstadoBadge(propuesta.estado)}
                  </div>
                  <p className="text-sm text-gray-600">
                    Profesor: <span className="font-semibold">{propuesta.profesor_nombre}</span>
                  </p>
                </div>
              </div>

              <p className="text-gray-700 mb-4">{propuesta.descripcion}</p>

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <span className="text-gray-600">Duración:</span>
                  <p className="font-semibold">{propuesta.duracion}</p>
                </div>
                <div>
                  <span className="text-gray-600">Requisitos:</span>
                  <p className="font-semibold">{propuesta.requisitos || 'Ninguno'}</p>
                </div>
              </div>

              {propuesta.estado === 'pendiente' && (
                <div className="flex gap-3 justify-end">
                  <Button
                    onClick={() => rechazar(propuesta.id)}
                    variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Rechazar
                  </Button>
                  <Button
                    onClick={() => aprobar(propuesta.id)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Aprobar
                  </Button>
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
