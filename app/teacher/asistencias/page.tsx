'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { FileUp, Calendar as CalendarIcon, Trash2, Camera, Download, FileImage } from 'lucide-react';
import Image from 'next/image';

interface Curso {
    id: number;
    nombre: string;
}

interface Asistencia {
    id: number;
    fecha_clase: string;
    archivo_url: string;
    fecha_subida: string;
}

export default function AsistenciasPage() {
    const [cursos, setCursos] = useState<Curso[]>([]);
    const [selectedCursoId, setSelectedCursoId] = useState<string>('');
    const [fechaClase, setFechaClase] = useState<string>('');
    const [file, setFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [asistencias, setAsistencias] = useState<Asistencia[]>([]);
    const [isLoadingAsistencias, setIsLoadingAsistencias] = useState(false);

    useEffect(() => {
        cargarCursos();
    }, []);

    useEffect(() => {
        if (selectedCursoId) {
            cargarAsistencias(parseInt(selectedCursoId));
        } else {
            setAsistencias([]);
        }
    }, [selectedCursoId]);

    const cargarCursos = async () => {
        try {
            const data = await api.getTeacherCourses();
            setCursos(data);
        } catch (error) {
            toast.error('Error al cargar tus cursos');
        }
    };

    const cargarAsistencias = async (cursoId: number) => {
        setIsLoadingAsistencias(true);
        try {
            const data = await api.getAsistenciasCurso(cursoId);
            setAsistencias(data);
        } catch (error) {
            toast.error('Error al cargar el historial de asistencias');
        } finally {
            setIsLoadingAsistencias(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCursoId || !fechaClase || !file) {
            toast.error('Por favor, completa todos los campos y adjunta una imagen');
            return;
        }

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('curso_id', selectedCursoId);
        formData.append('fecha_clase', fechaClase);
        formData.append('file', file);

        try {
            await api.subirAsistencia(formData);
            toast.success('Asistencia subida exitosamente');
            setFile(null);
            setFechaClase('');
            // Reset input file (hacky but works)
            const fileInput = document.getElementById('archivo') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
            
            // Recargar lista
            cargarAsistencias(parseInt(selectedCursoId));
        } catch (error: any) {
            toast.error(error.message || 'Error al subir la asistencia');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBorrar = async (id: number) => {
        if (!confirm('¿Estás seguro de que deseas eliminar este registro de asistencia?')) return;
        
        try {
            await api.borrarAsistencia(id);
            toast.success('Registro eliminado');
            setAsistencias(asistencias.filter(a => a.id !== id));
        } catch (error: any) {
            toast.error(error.message || 'Error al eliminar');
        }
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-10">
            <div>
                <h1 className="text-3xl font-bold text-[#1e3a8a] mb-2">Control de Asistencias</h1>
                <p className="text-gray-600">Sube fotos o escaneos de las hojas de firmas de tus clases para mantener un registro histórico.</p>
            </div>

            <Card className="border-t-4 border-t-[#1e3a8a] shadow-sm">
                <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2 text-[#1e3a8a]">
                        <FileUp size={24} /> Subir Nueva Asistencia
                    </CardTitle>
                    <CardDescription>
                        Selecciona el curso, indica la fecha exacta de la clase y adjunta la imagen.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Curso <span className="text-red-500">*</span></Label>
                                <Select value={selectedCursoId} onValueChange={setSelectedCursoId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona el curso..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {cursos.length === 0 ? (
                                            <div className="p-2 text-sm text-gray-500">No tienes cursos asignados</div>
                                        ) : (
                                            cursos.map(curso => (
                                                <SelectItem key={curso.id} value={curso.id.toString()}>
                                                    {curso.nombre}
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="fecha">Fecha de la Clase <span className="text-red-500">*</span></Label>
                                <div className="relative">
                                    <Input 
                                        id="fecha" 
                                        type="date"
                                        value={fechaClase}
                                        onChange={(e) => setFechaClase(e.target.value)}
                                        className="pl-10"
                                    />
                                    <CalendarIcon className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                                </div>
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="archivo">Fotografía de la Hoja de Firmas <span className="text-red-500">*</span></Label>
                                <Input 
                                    id="archivo" 
                                    type="file" 
                                    accept="image/*,application/pdf"
                                    onChange={handleFileChange} 
                                    className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                                <p className="text-xs text-gray-500 mt-1">Formatos soportados: JPG, PNG, PDF. Asegúrate de que la foto sea legible.</p>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-gray-100">
                            <Button 
                                type="submit" 
                                disabled={isSubmitting || !selectedCursoId || !fechaClase || !file} 
                                className="bg-[#1e3a8a] hover:bg-[#152960]"
                            >
                                {isSubmitting ? 'Subiendo...' : 'Guardar Asistencia'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Historial Section */}
            {selectedCursoId && (
                <div className="mt-12 space-y-4">
                    <div className="flex items-center justify-between border-b pb-2">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Camera className="text-blue-600" />
                            Historial del Curso
                        </h2>
                        <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                            {asistencias.length} Registros
                        </span>
                    </div>

                    {isLoadingAsistencias ? (
                        <div className="text-center py-10 text-gray-500">Cargando registros...</div>
                    ) : asistencias.length === 0 ? (
                        <Card className="bg-gray-50 border-dashed">
                            <CardContent className="flex flex-col items-center justify-center py-12 text-gray-400">
                                <FileImage size={48} className="mb-4 opacity-20" />
                                <p>No hay hojas de asistencia registradas para este curso.</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {asistencias.map((asist) => {
                                const isImage = asist.archivo_url.match(/\.(jpeg|jpg|gif|png)$/i) != null;
                                const urlCompleta = `http://127.0.0.1:5000${asist.archivo_url}`;
                                
                                return (
                                    <Card key={asist.id} className="overflow-hidden group hover:shadow-md transition-shadow">
                                        <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden border-b flex items-center justify-center">
                                            {isImage ? (
                                                <img 
                                                    src={urlCompleta} 
                                                    alt={`Asistencia ${asist.fecha_clase}`}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div className="flex flex-col items-center text-gray-400">
                                                    <FileUp size={40} className="mb-2" />
                                                    <span className="font-medium text-sm">Documento PDF/Otro</span>
                                                </div>
                                            )}
                                            
                                            {/* Overlay para ver/descargar */}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <a 
                                                    href={urlCompleta} 
                                                    target="_blank" 
                                                    rel="noreferrer"
                                                    className="bg-white text-gray-900 px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2 hover:bg-blue-50 transition-colors shadow-lg"
                                                >
                                                    <Download size={16} /> Ver Archivo
                                                </a>
                                            </div>
                                        </div>
                                        <CardContent className="p-4 flex justify-between items-center bg-white">
                                            <div>
                                                <p className="font-bold text-gray-900">
                                                    Clase: {new Date(asist.fecha_clase).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'long' })}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Subido el {new Date(asist.fecha_subida).toLocaleDateString('es-ES')}
                                                </p>
                                            </div>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => handleBorrar(asist.id)}
                                                title="Eliminar registro"
                                            >
                                                <Trash2 size={18} />
                                            </Button>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
