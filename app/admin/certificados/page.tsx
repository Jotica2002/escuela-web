'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api, MEDIA_URL } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { UploadCloud, FileType, FileBadge, Inbox, Clock, CheckCircle2, XCircle, FileDown, ChevronDown, ChevronUp } from 'lucide-react';
import { User } from '@/contexts/AuthContext';

interface Solicitud {
  id: number;
  estudiante_id: number;
  estudiante_nombre: string;
  estudiante_cedula: string;
  profesion: string;
  experiencia: string;
  email_contacto: string;
  archivo_evidencia_url: string | null;
  estado: 'pendiente' | 'aprobada' | 'rechazada';
  fecha_solicitud: string;
}

const ESTADO_CONFIG = {
  pendiente: { label: 'Pendiente', bg: 'bg-yellow-100 text-yellow-800', icon: Clock },
  aprobada:  { label: 'Aprobada',  bg: 'bg-green-100 text-green-800',  icon: CheckCircle2 },
  rechazada: { label: 'Rechazada', bg: 'bg-red-100 text-red-800',      icon: XCircle },
};

export default function AdminCertificadosPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'subir' | 'solicitudes'>('solicitudes');
  const [estudiantes, setEstudiantes] = useState<User[]>([]);
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Form state
  const [selectedEstudiante, setSelectedEstudiante] = useState('');
  const [nombreCurso, setNombreCurso] = useState('');
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [usuarios, sols] = await Promise.all([
        api.getAdminUsuarios(),
        api.getAdminSolicitudesCertificados(),
      ]);
      setEstudiantes(usuarios.filter((u: User) => u.rol === 'student'));
      setSolicitudes(sols);
    } catch (error) {
      toast.error('Error al cargar datos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(selectedFile.type)) {
        toast.error('Solo se permiten archivos PDF o Word (.doc, .docx)');
        setFile(null);
        e.target.value = '';
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEstudiante || !nombreCurso || !file) {
      toast.error('Por favor completa todos los campos');
      return;
    }
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('estudiante_id', selectedEstudiante);
      formData.append('nombre_curso', nombreCurso);
      formData.append('file', file);
      await api.subirCertificado(formData);
      toast.success('Certificado subido exitosamente');
      setSelectedEstudiante('');
      setNombreCurso('');
      setFile(null);
      const fileInput = document.getElementById('archivo') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al subir certificado');
    } finally {
      setIsUploading(false);
    }
  };

  const handleEstadoChange = async (id: number, estado: string) => {
    try {
      await api.updateAdminSolicitudEstado(id, estado);
      toast.success(`Solicitud marcada como "${ESTADO_CONFIG[estado as keyof typeof ESTADO_CONFIG]?.label}"`);
      setSolicitudes(prev => prev.map(s => s.id === id ? { ...s, estado: estado as Solicitud['estado'] } : s));
    } catch (error) {
      toast.error('Error al actualizar el estado');
    }
  };

  if (isLoading) {
    return <div className="p-8 flex justify-center"><div className="animate-spin h-8 w-8 border-4 border-[#1e3a8a] border-t-transparent rounded-full"></div></div>;
  }

  const pendientes = solicitudes.filter(s => s.estado === 'pendiente').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Certificados</h1>
        <p className="text-gray-500 mt-1">Sube certificados de curso y gestiona las solicitudes de certificación por experiencia.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('solicitudes')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'solicitudes'
              ? 'border-[#1e3a8a] text-[#1e3a8a]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Inbox size={16} />
          Solicitudes Recibidas
          {pendientes > 0 && (
            <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-0.5 rounded-full">
              {pendientes}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('subir')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'subir'
              ? 'border-[#1e3a8a] text-[#1e3a8a]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <UploadCloud size={16} />
          Subir Certificado de Curso
        </button>
      </div>

      {/* TAB: Solicitudes */}
      {activeTab === 'solicitudes' && (
        <div className="space-y-4">
          {solicitudes.length === 0 ? (
            <Card className="py-16">
              <CardContent className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <Inbox size={32} className="text-gray-400" />
                </div>
                <h3 className="font-bold text-gray-700 text-lg">No hay solicitudes aún</h3>
                <p className="text-gray-500 text-sm">Cuando un estudiante solicite un certificado por experiencia, aparecerá aquí.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {solicitudes.map(sol => {
                const estadoInfo = ESTADO_CONFIG[sol.estado];
                const EstadoIcon = estadoInfo.icon;
                const isExpanded = expandedId === sol.id;
                return (
                  <Card key={sol.id} className="overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    {/* Header Row */}
                    <div className="p-5 flex flex-wrap items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-gray-900">{sol.estudiante_nombre}</h3>
                          {sol.estudiante_cedula && (
                            <span className="text-xs text-gray-400">C.I: {sol.estudiante_cedula}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                          <span className="text-sm font-semibold text-[#1e3a8a]">{sol.profesion}</span>
                          <span className="text-xs text-gray-400">{new Date(sol.fecha_solicitud).toLocaleDateString('es-ES')}</span>
                          <a href={`mailto:${sol.email_contacto}`} className="text-xs text-blue-600 hover:underline">{sol.email_contacto}</a>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        {/* Estado Badge */}
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${estadoInfo.bg}`}>
                          <EstadoIcon size={12} /> {estadoInfo.label}
                        </span>
                        {/* Change Estado */}
                        <Select value={sol.estado} onValueChange={val => handleEstadoChange(sol.id, val)}>
                          <SelectTrigger className="h-8 text-xs w-36">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pendiente">Pendiente</SelectItem>
                            <SelectItem value="aprobada">Aprobada</SelectItem>
                            <SelectItem value="rechazada">Rechazada</SelectItem>
                          </SelectContent>
                        </Select>
                        {/* Expand */}
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : sol.id)}
                          className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="border-t border-gray-100 bg-gray-50/60 p-5 space-y-4">
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Descripción de Experiencia</p>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{sol.experiencia}</p>
                        </div>
                        {sol.archivo_evidencia_url && (
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Archivo de Evidencia</p>
                            <a
                              href={`${MEDIA_URL}${sol.archivo_evidencia_url}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-[#1e3a8a] hover:bg-blue-100 rounded-lg text-sm font-medium transition-colors"
                            >
                              <FileDown size={16} /> Ver / Descargar Evidencia
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB: Subir Certificado */}
      {activeTab === 'subir' && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-t-4 border-t-[#1e3a8a] shadow-md">
            <CardHeader>
              <CardTitle className="text-xl text-[#1e3a8a] flex items-center gap-2">
                <UploadCloud size={24} /> Subir Nuevo Certificado
              </CardTitle>
              <CardDescription>
                Asegúrate de que el documento esté en formato PDF o Word y pertenezca al estudiante correcto.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Seleccionar Estudiante */}
                <div className="space-y-2">
                  <Label htmlFor="estudiante">Estudiante</Label>
                  <Select value={selectedEstudiante} onValueChange={setSelectedEstudiante}>
                    <SelectTrigger id="estudiante">
                      <SelectValue placeholder="Selecciona un estudiante..." />
                    </SelectTrigger>
                    <SelectContent>
                      {estudiantes.map((est) => (
                        <SelectItem key={est.id} value={est.id.toString()}>
                          {est.nombre} {est.cedula ? `(${est.cedula})` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* Nombre del Curso */}
                <div className="space-y-2">
                  <Label htmlFor="curso">Nombre del Curso</Label>
                  <Input
                    id="curso"
                    placeholder="Ej: Marketing Digital Básico"
                    value={nombreCurso}
                    onChange={(e) => setNombreCurso(e.target.value)}
                    className="focus-visible:ring-[#1e3a8a]"
                  />
                </div>
                {/* Archivo */}
                <div className="space-y-2">
                  <Label htmlFor="archivo">Archivo del Certificado (PDF o Word)</Label>
                  <Input
                    id="archivo"
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleFileChange}
                    className="cursor-pointer file:bg-blue-50 file:text-[#1e3a8a] file:font-semibold file:border-0 file:rounded-md file:px-4 file:py-2 hover:file:bg-blue-100 transition-colors border-gray-200"
                  />
                </div>
                {file && (
                  <p className="text-sm text-green-600 flex items-center gap-1 bg-green-50 p-2 rounded-md border border-green-200 font-medium">
                    <FileType size={16} /> Archivo listo: {file.name}
                  </p>
                )}
                <Button
                  type="submit"
                  disabled={isUploading}
                  className="w-full bg-[#1e3a8a] hover:bg-[#152960] text-white font-medium py-2 rounded-md shadow-sm transition-all mt-4"
                >
                  {isUploading ? 'Subiendo archivo...' : 'Subir Certificado al Estudiante'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
