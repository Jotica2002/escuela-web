'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Proposal {
  id: string;
  nombre: string;
  descripcion: string;
  duracion: string;
  requisitos: string;
  estado: 'pendiente' | 'aprobado' | 'rechazado';
  fechaCreacion: string;
}

interface ProposalsTableProps {
  proposals: Proposal[];
  isLoading: boolean;
}

export function ProposalsTable({ proposals, isLoading }: ProposalsTableProps) {
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      pendiente: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
      aprobado: { label: 'Aprobado', color: 'bg-green-100 text-green-800' },
      rechazado: { label: 'Rechazado', color: 'bg-red-100 text-red-800' },
    };

    const config = statusMap[status] || { label: status, color: 'bg-gray-100' };

    return (
      <Badge className={`${config.color} border-0`}>
        {config.label}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mis Propuestas de Cursos</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">Cargando propuestas...</div>
        ) : proposals.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No tienes propuestas de cursos aún
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Duración</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha Creación</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {proposals.map((proposal) => (
                  <TableRow key={proposal.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{proposal.nombre}</TableCell>
                    <TableCell>{proposal.duracion}</TableCell>
                    <TableCell>{getStatusBadge(proposal.estado)}</TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {new Date(proposal.fechaCreacion).toLocaleDateString('es-ES')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
