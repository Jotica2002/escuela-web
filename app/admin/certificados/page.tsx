'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { UploadCloud, FileType } from 'lucide-react';
import { User } from '@/contexts/AuthContext';

export default function AdminCertificadosPage() {
  const { user } = useAuth();
  const [estudiantes, setEstudiantes] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  
  // Form state
  const [selectedEstudiante, setSelectedEstudiante] = useState('');
  const [nombreCurso, setNombreCurso] = useState('');
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    cargarEstudiantes();
  }, []);

  const cargarEstudiantes = async () => {
    try {
      const usuarios = await api.getAdminUsuarios();
      const soloEstudiantes = usuarios.filter((u: User) => u.rol === 'student');
      setEstudiantes(soloEstudiantes);
    } catch (error) {
      toast.error('Error al cargar estudiantes');
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
      
      // Reset form
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

  if (isLoading) {
    return <div className="p-8 flex justify-center"><div className="animate-spin h-8 w-8 border-4 border-[#1e3a8a] border-t-transparent rounded-full"></div></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Gestión de Certificados</h1>
      <p className="text-gray-500">Sube los certificados de culminación para los estudiantes aprobados.</p>

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
                <div className="flex flex-col gap-2">
                  <Input
                    id="archivo"
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleFileChange}
                    className="cursor-pointer file:bg-blue-50 file:text-[#1e3a8a] file:font-semibold file:border-0 file:rounded-md file:px-4 file:py-2 hover:file:bg-blue-100 transition-colors border-gray-200"
                  />
                </div>
                {file && (
                  <p className="text-sm text-green-600 flex items-center gap-1 mt-2 bg-green-50 p-2 rounded-md border border-green-200 font-medium">
                    <FileType size={16} /> Archivo listo: {file.name}
                  </p>
                )}
              </div>

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
    </div>
  );
}
