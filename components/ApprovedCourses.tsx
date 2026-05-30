'use client';

import { useState, useEffect } from 'react';
import { api, MEDIA_URL } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Clock, BookOpen, Pencil, X, ChevronDown, ChevronUp, Users, Calendar, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Curso {
  id: number;
  nombre: string;
  descripcion: string;
  duracion: string;
  profesor_id: number;
  profesor_nombre: string;
  estado: string;
  imagen_url?: string;
  fecha_creacion: string;
}

interface ApprovedCoursesProps {
  onCourseUpdated?: () => void;
}

export function ApprovedCourses({ onCourseUpdated }: ApprovedCoursesProps) {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Edit modal state
  const [editingCurso, setEditingCurso] = useState<Curso | null>(null);
  const [editForm, setEditForm] = useState({ nombre: '', descripcion: '', duracion: '' });
  const [editImagen, setEditImagen] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // View modals state
  const [viewingHorarioCurso, setViewingHorarioCurso] = useState<Curso | null>(null);
  const [viewingAsistenciasCurso, setViewingAsistenciasCurso] = useState<Curso | null>(null);
  const [horario, setHorario] = useState<any>(null);
  const [asistencias, setAsistencias] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    cargarCursos();
  }, []);

  const cargarCursos = async () => {
    try {
      setLoading(true);
      const data = await api.getAdminCursos();
      setCursos(data);
    } catch (error) {
      toast.error('Error al cargar cursos');
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (curso: Curso) => {
    setEditingCurso(curso);
    setEditForm({ nombre: curso.nombre, descripcion: curso.descripcion || '', duracion: curso.duracion || '' });
    setEditImagen(null);
  };

  const openHorario = async (curso: Curso) => {
    setViewingHorarioCurso(curso);
    setLoadingData(true);
    setHorario(null);
    try {
      const data = await api.getHorarioCurso(curso.id);
      setHorario(data);
    } catch (err: any) {
      toast.error('Error al cargar el horario');
    } finally {
      setLoadingData(false);
    }
  };

  const openAsistencias = async (curso: Curso) => {
    setViewingAsistenciasCurso(curso);
    setLoadingData(true);
    setAsistencias([]);
    try {
      const data = await api.getAsistenciasCurso(curso.id);
      setAsistencias(data);
    } catch (err: any) {
      toast.error('Error al cargar las asistencias');
    } finally {
      setLoadingData(false);
    }
  };

  const handleDelete = async (cursoId: number) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este curso? Esta acción no se puede deshacer.")) return;
    try {
      await api.adminEliminarCurso(cursoId);
      toast.success('Curso eliminado correctamente');
      await cargarCursos();
      onCourseUpdated?.();
    } catch (err: any) {
      toast.error(err.message || 'Error al eliminar curso');
    }
  };

  const handleSaveEdit = async () => {
    if (!editingCurso) return;
    if (!editForm.nombre.trim()) { toast.error('El nombre es obligatorio'); return; }
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append('nombre', editForm.nombre);
      if (editForm.descripcion) formData.append('descripcion', editForm.descripcion);
      if (editForm.duracion) formData.append('duracion', editForm.duracion);
      if (editImagen) formData.append('imagen', editImagen);

      await api.adminEditarCurso(editingCurso.id, formData);
      toast.success('Curso actualizado correctamente ✅');
      setEditingCurso(null);
      await cargarCursos();
      onCourseUpdated?.();
    } catch (err: any) {
      toast.error(err.message || 'Error al actualizar');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Cargando cursos...</div>;
  }

  const cursosActivos = cursos.filter(c => c.estado === 'activo');

  return (
    <>
      {/* Edit Modal */}
      {editingCurso && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Pencil size={18} className="text-blue-600" /> Editar Curso
              </h2>
              <button onClick={() => setEditingCurso(null)} className="text-gray-400 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Nombre del Curso *</Label>
                <Input value={editForm.nombre} onChange={e => setEditForm(f => ({ ...f, nombre: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Descripción</Label>
                <textarea
                  value={editForm.descripcion}
                  onChange={e => setEditForm(f => ({ ...f, descripcion: e.target.value }))}
                  rows={4}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
                  placeholder="Describe el contenido del curso..."
                />
              </div>
              <div className="space-y-1.5">
                <Label>Duración Estimada</Label>
                <Input value={editForm.duracion} onChange={e => setEditForm(f => ({ ...f, duracion: e.target.value }))} placeholder="Ej: 8 semanas, 40 horas..." />
              </div>
              <div className="space-y-1.5">
                <Label>Nueva Imagen (Opcional)</Label>
                <Input type="file" accept="image/*" onChange={e => setEditImagen(e.target.files?.[0] || null)} />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setEditingCurso(null)}>Cancelar</Button>
              <Button className="flex-1 bg-[#1e3a8a] hover:bg-[#152960]" disabled={isSaving} onClick={handleSaveEdit}>
                {isSaving ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Courses List */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Cursos Aprobados</h2>
          <p className="text-gray-600">Total de cursos activos: {cursosActivos.length}</p>
        </div>

        <div className="space-y-3">
          {cursosActivos.length === 0 ? (
            <Card className="p-8 text-center text-gray-500">No hay cursos aprobados aún</Card>
          ) : (
            cursosActivos.map(curso => {
              const isExpanded = expandedId === curso.id;
              return (
                <Card key={curso.id} className="overflow-hidden border-l-4 border-l-[#1e3a8a] hover:shadow-md transition-shadow">
                  {/* Header row */}
                  <div className="p-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <BookOpen className="w-5 h-5 text-[#1e3a8a] flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base truncate">{curso.nombre}</h3>
                        <p className="text-xs text-gray-500">Profesor: {curso.profesor_nombre}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge className="bg-green-100 text-green-800">Activo</Badge>
                      <button
                        onClick={() => openEdit(curso)}
                        title="Editar curso"
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(curso.id)}
                        title="Eliminar curso"
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : curso.id)}
                        title={isExpanded ? 'Ocultar detalles' : 'Ver detalles'}
                        className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded detail panel */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 bg-gray-50/60 p-5 space-y-4">
                      {curso.imagen_url && (
                        <div className="mb-4">
                          <img 
                            src={`${MEDIA_URL}/uploads/${curso.imagen_url}`} 
                            alt={curso.nombre} 
                            className="w-full max-h-48 object-cover rounded-xl shadow-sm"
                          />
                        </div>
                      )}
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Descripción</p>
                        <p className="text-sm text-gray-700">{curso.descripcion || <span className="italic text-gray-400">Sin descripción</span>}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock size={14} />
                          <span><strong>Duración:</strong> {curso.duracion || 'Por definir'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar size={14} />
                          <span><strong>Creado:</strong> {new Date(curso.fecha_creacion).toLocaleDateString('es-ES')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Users size={14} />
                          <span><strong>Instructor:</strong> {curso.profesor_nombre}</span>
                        </div>
                      </div>
                      <div className="pt-3 flex flex-wrap gap-3 border-t border-gray-100">
                        <Button variant="outline" size="sm" onClick={() => openHorario(curso)} className="flex items-center gap-2">
                          <Calendar size={14} /> Ver Horario
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => openAsistencias(curso)} className="flex items-center gap-2">
                          <Users size={14} /> Ver Asistencias
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })
          )}
        </div>
      </div>

      {/* Horario Modal */}
      {viewingHorarioCurso && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Calendar size={18} className="text-blue-600" /> Horario: {viewingHorarioCurso.nombre}
              </h2>
              <button onClick={() => setViewingHorarioCurso(null)} className="text-gray-400 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <div className="min-h-[100px]">
              {loadingData ? (
                <div className="text-center text-gray-500 py-4">Cargando horario...</div>
              ) : !horario ? (
                <div className="text-center text-gray-500 py-4">El profesor no ha subido un horario aún.</div>
              ) : (
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 rounded-lg text-sm text-gray-800 whitespace-pre-wrap">
                    {horario.descripcion}
                  </div>
                  {horario.archivo_url && (
                    <div className="mt-3">
                      <a href={`${MEDIA_URL}/uploads/${horario.archivo_url}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-sm font-medium">
                        Ver archivo adjunto
                      </a>
                    </div>
                  )}
                  <p className="text-xs text-gray-400 text-right">Actualizado: {new Date(horario.fecha_actualizacion).toLocaleDateString('es-ES')}</p>
                </div>
              )}
            </div>
            <div className="flex justify-end pt-2">
              <Button onClick={() => setViewingHorarioCurso(null)}>Cerrar</Button>
            </div>
          </div>
        </div>
      )}

      {/* Asistencias Modal */}
      {viewingAsistenciasCurso && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-5 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between shrink-0">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Users size={18} className="text-blue-600" /> Asistencias
              </h2>
              <button onClick={() => setViewingAsistenciasCurso(null)} className="text-gray-400 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {loadingData ? (
                <div className="text-center text-gray-500 py-4">Cargando asistencias...</div>
              ) : asistencias.length === 0 ? (
                <div className="text-center text-gray-500 py-4">No hay listas de asistencia subidas.</div>
              ) : (
                <div className="space-y-3 pr-2">
                  {asistencias.map((asist, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                      <div>
                        <p className="font-semibold text-sm">Clase del {new Date(asist.fecha_clase).toLocaleDateString('es-ES')}</p>
                        <p className="text-xs text-gray-500">Subida: {new Date(asist.fecha_subida).toLocaleDateString('es-ES')}</p>
                      </div>
                      <a 
                        href={`${MEDIA_URL}/uploads/${asist.archivo_url}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-md hover:bg-blue-200 transition-colors font-medium"
                      >
                        Descargar
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex justify-end pt-2 shrink-0">
              <Button onClick={() => setViewingAsistenciasCurso(null)}>Cerrar</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
