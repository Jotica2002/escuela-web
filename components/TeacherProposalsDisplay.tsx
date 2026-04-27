'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Clock, XCircle, RefreshCw } from 'lucide-react';

interface Proposal {
  id: string;
  nombre: string;
  descripcion: string;
  duracion: string;
  requisitos: string;
  estado: 'pendiente' | 'aprobado' | 'rechazado';
  fecha_creacion: string;
}

interface TeacherProposalsDisplayProps {
  proposals: Proposal[];
  onRefresh: () => void;
  isLoading?: boolean;
}

export function TeacherProposalsDisplay({
  proposals,
  onRefresh,
  isLoading = false
}: TeacherProposalsDisplayProps) {
  const [filter, setFilter] = useState<'todos' | 'pendiente' | 'aprobado' | 'rechazado'>('todos');

  const filteredProposals = filter === 'todos'
    ? proposals
    : proposals.filter(p => p.estado === filter);

  const getEstadoConfig = (estado: string) => {
    switch (estado) {
      case 'aprobado':
        return {
          icon: CheckCircle2,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          label: 'Aprobado',
          badge: 'bg-green-100 text-green-800'
        };
      case 'rechazado':
        return {
          icon: XCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          label: 'Rechazado',
          badge: 'bg-red-100 text-red-800'
        };
      case 'pendiente':
      default:
        return {
          icon: Clock,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          label: 'Pendiente',
          badge: 'bg-yellow-100 text-yellow-800'
        };
    }
  };

  const stats = {
    total: proposals.length,
    aprobadas: proposals.filter(p => p.estado === 'aprobado').length,
    rechazadas: proposals.filter(p => p.estado === 'rechazado').length,
    pendientes: proposals.filter(p => p.estado === 'pendiente').length
  };

  return (
    <div className="space-y-6">
      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Total Propuestas</p>
            <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Aprobadas</p>
            <p className="text-2xl font-bold text-green-600">{stats.aprobadas}</p>
          </CardContent>
        </Card>
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Pendientes</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pendientes}</p>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Rechazadas</p>
            <p className="text-2xl font-bold text-red-600">{stats.rechazadas}</p>
          </CardContent>
        </Card>
      </div>

      {/* Controles */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('todos')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === 'todos'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilter('pendiente')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === 'pendiente'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pendientes
          </button>
          <button
            onClick={() => setFilter('aprobado')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === 'aprobado'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Aprobadas
          </button>
          <button
            onClick={() => setFilter('rechazado')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === 'rechazado'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Rechazadas
          </button>
        </div>
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="p-2 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Lista de propuestas */}
      <div className="space-y-3">
        {filteredProposals.length > 0 ? (
          filteredProposals.map(proposal => {
            const config = getEstadoConfig(proposal.estado);
            const IconComponent = config.icon;

            return (
              <Card
                key={proposal.id}
                className={`${config.bgColor} border-l-4 ${config.borderColor}`}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <IconComponent className={`w-5 h-5 ${config.color}`} />
                        <h3 className="font-bold text-gray-900">{proposal.nombre}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${config.badge}`}>
                          {config.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{proposal.descripcion}</p>
                      <div className="flex gap-4 text-xs text-gray-600">
                        <span>Duración: {proposal.duracion}</span>
                        <span>Requisitos: {proposal.requisitos || 'Ninguno'}</span>
                        <span>
                          Creado: {new Date(proposal.fecha_creacion).toLocaleDateString('es-ES')}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card className="border-dashed border-gray-300">
            <CardContent className="pt-8 pb-8">
              <p className="text-center text-gray-500">No hay propuestas en esta categoría</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
