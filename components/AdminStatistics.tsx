'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Users, BookOpen, Clock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';

interface Stats {
  total_usuarios: number;
  total_estudiantes: number;
  total_profesores: number;
  total_convenios: number;
  total_cursos: number;
  total_propuestas: number;
  propuestas_pendientes: number;
  propuestas_aprobadas: number;
  propuestas_rechazadas: number;
}

interface User {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  fecha_creacion: string;
}

interface Curso {
  id: number;
  nombre: string;
  profesor_nombre: string;
  estado: string;
}

interface Proposal {
  id: number;
  nombre: string;
  profesor_nombre: string;
  estado: string;
}

type ModalType = 'usuarios' | 'estudiantes' | 'profesores' | 'convenios' | 'cursos' | 'propuestas:todas' | 'propuestas:pendientes' | 'propuestas:aprobadas' | 'propuestas:rechazadas' | null;

export function AdminStatistics() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [modalData, setModalData] = useState<any[]>([]);
  const [loadingModal, setLoadingModal] = useState(false);

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      setLoading(true);
      const data = await api.getAdminEstadisticas();
      setStats(data);
    } catch (error) {
      toast.error('Error al cargar estadísticas');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = async (type: ModalType) => {
    if (!type) return;
    setActiveModal(type);
    setLoadingModal(true);
    setModalData([]);

    try {
      if (type.startsWith('propuestas')) {
        const propuestas = await api.getAdminPropuestas();
        const subType = type.split(':')[1];
        if (subType === 'todas') {
          setModalData(propuestas);
        } else {
          setModalData(propuestas.filter((p: any) => p.estado === subType.replace('pendientes', 'pendiente').replace('aprobadas', 'aprobado').replace('rechazadas', 'rechazado')));
        }
      } else if (type === 'cursos') {
        const cursos = await api.getAdminCursos();
        setModalData(cursos);
      } else {
        // Users
        const usuarios = await api.getAdminUsuarios();
        if (type === 'usuarios') {
          setModalData(usuarios);
        } else if (type === 'estudiantes') {
          setModalData(usuarios.filter((u: any) => u.rol === 'student'));
        } else if (type === 'profesores') {
          setModalData(usuarios.filter((u: any) => u.rol === 'teacher' || u.rol === 'profesor'));
        } else if (type === 'convenios') {
          setModalData(usuarios.filter((u: any) => u.rol === 'convenio'));
        }
      }
    } catch (error) {
      toast.error('Error al cargar información detallada');
      setActiveModal(null);
    } finally {
      setLoadingModal(false);
    }
  };

  const renderModalContent = () => {
    if (loadingModal) {
      return <div className="p-8 text-center text-gray-500">Cargando datos...</div>;
    }

    if (modalData.length === 0) {
      return <div className="p-8 text-center text-gray-500">No hay registros para mostrar.</div>;
    }

    const typePrefix = activeModal?.split(':')[0];

    if (activeModal === 'usuarios' || activeModal === 'estudiantes' || activeModal === 'profesores' || activeModal === 'convenios') {
      return (
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {modalData.map((user: User) => (
            <div key={user.id} className="p-3 border rounded-lg flex justify-between items-center bg-gray-50">
              <div>
                <p className="font-bold text-gray-900">{user.nombre}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <Badge className={
                user.rol === 'admin' ? 'bg-purple-100 text-purple-800' : 
                user.rol === 'teacher' || user.rol === 'profesor' ? 'bg-blue-100 text-blue-800' : 
                user.rol === 'convenio' ? 'bg-amber-100 text-amber-800' :
                'bg-green-100 text-green-800'
              }>
                {user.rol === 'teacher' || user.rol === 'profesor' ? 'Profesor' : 
                 user.rol === 'student' ? 'Estudiante' : 
                 user.rol === 'convenio' ? 'Convenio' :
                 'Admin'}
              </Badge>
            </div>
          ))}
        </div>
      );
    }

    if (activeModal === 'cursos') {
      return (
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {modalData.map((curso: Curso) => (
            <div key={curso.id} className="p-3 border rounded-lg flex flex-col gap-1 bg-orange-50/50">
              <div className="flex justify-between">
                <p className="font-bold text-gray-900">{curso.nombre}</p>
                <Badge className={curso.estado === 'activo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>{curso.estado}</Badge>
              </div>
              <p className="text-sm text-gray-600">Prof: {curso.profesor_nombre}</p>
            </div>
          ))}
        </div>
      );
    }

    if (typePrefix === 'propuestas') {
      return (
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {modalData.map((prop: Proposal) => {
            let badgeColors = 'bg-yellow-100 text-yellow-800';
            if (prop.estado === 'aprobado') badgeColors = 'bg-green-100 text-green-800';
            if (prop.estado === 'rechazado') badgeColors = 'bg-red-100 text-red-800';

            return (
              <div key={prop.id} className="p-3 border rounded-lg flex flex-col gap-1 bg-gray-50">
                <div className="flex justify-between">
                  <p className="font-bold text-gray-900">{prop.nombre}</p>
                  <Badge className={badgeColors}>{prop.estado}</Badge>
                </div>
                <p className="text-sm text-gray-600">Proponente: {prop.profesor_nombre}</p>
              </div>
            );
          })}
        </div>
      );
    }

    return null;
  };

  const modalTitles: Record<string, string> = {
    'usuarios': 'Todos los Usuarios',
    'estudiantes': 'Listado de Estudiantes',
    'profesores': 'Listado de Profesores',
    'convenios': 'Listado de Convenios',
    'cursos': 'Cursos Activos',
    'propuestas:todas': 'Todas las Propuestas',
    'propuestas:pendientes': 'Propuestas Pendientes',
    'propuestas:aprobadas': 'Propuestas Aprobadas',
    'propuestas:rechazadas': 'Propuestas Rechazadas',
  };

  if (loading || !stats) {
    return <div className="text-center py-8">Cargando estadísticas...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Estadísticas del Sistema</h2>

      <div className="grid gap-4 md:grid-cols-4">
        {/* Clickable Cards */}
        <Card onClick={() => openModal('usuarios')} className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 cursor-pointer hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total de Usuarios</p>
              <p className="text-3xl font-bold text-blue-600">{stats.total_usuarios}</p>
            </div>
            <Users className="w-10 h-10 text-blue-400 opacity-50" />
          </div>
        </Card>

        <Card onClick={() => openModal('estudiantes')} className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200 cursor-pointer hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Estudiantes</p>
              <p className="text-3xl font-bold text-green-600">{stats.total_estudiantes}</p>
            </div>
            <Users className="w-10 h-10 text-green-400 opacity-50" />
          </div>
        </Card>

        <Card onClick={() => openModal('profesores')} className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 cursor-pointer hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Profesores</p>
              <p className="text-3xl font-bold text-purple-600">{stats.total_profesores}</p>
            </div>
            <Users className="w-10 h-10 text-purple-400 opacity-50" />
          </div>
        </Card>

        <Card onClick={() => openModal('convenios')} className="p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 cursor-pointer hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Convenios</p>
              <p className="text-3xl font-bold text-emerald-600">{stats.total_convenios || 0}</p>
            </div>
            <Users className="w-10 h-10 text-emerald-400 opacity-50" />
          </div>
        </Card>

        <Card onClick={() => openModal('cursos')} className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 cursor-pointer hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Cursos Activos</p>
              <p className="text-3xl font-bold text-orange-600">{stats.total_cursos}</p>
            </div>
            <BookOpen className="w-10 h-10 text-orange-400 opacity-50" />
          </div>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card onClick={() => openModal('propuestas:todas')} className="p-6 bg-white border-gray-200 cursor-pointer hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Propuestas Totales</p>
              <p className="text-2xl font-bold">{stats.total_propuestas}</p>
            </div>
            <Clock className="w-8 h-8 text-gray-400" />
          </div>
        </Card>

        <Card onClick={() => openModal('propuestas:pendientes')} className="p-6 bg-yellow-50 border-yellow-200 cursor-pointer hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pendientes</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.propuestas_pendientes}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-400" />
          </div>
        </Card>

        <Card onClick={() => openModal('propuestas:aprobadas')} className="p-6 bg-green-50 border-green-200 cursor-pointer hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Aprobadas</p>
              <p className="text-2xl font-bold text-green-600">{stats.propuestas_aprobadas}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </Card>

        <Card onClick={() => openModal('propuestas:rechazadas')} className="p-6 bg-red-50 border-red-200 cursor-pointer hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Rechazadas</p>
              <p className="text-2xl font-bold text-red-600">{stats.propuestas_rechazadas}</p>
            </div>
            <Clock className="w-8 h-8 text-red-400" />
          </div>
        </Card>
      </div>

      <Dialog open={!!activeModal} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{activeModal ? modalTitles[activeModal] : ''}</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            {renderModalContent()}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
