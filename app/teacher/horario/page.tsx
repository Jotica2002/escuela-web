'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { api, MEDIA_URL } from '@/lib/api';
import { CalendarDays, Save, ExternalLink, Image as ImageIcon } from 'lucide-react';

interface Curso {
    id: number;
    nombre: string;
}

interface Horario {
    id: number;
    descripcion: string;
    archivo_url: string | null;
    fecha_actualizacion: string;
}

export default function HorarioPage() {
    const [cursos, setCursos] = useState<Curso[]>([]);
    const [selectedCursoId, setSelectedCursoId] = useState<string>('');
    const [descripcion, setDescripcion] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [currentHorario, setCurrentHorario] = useState<Horario | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        api.getTeacherCourses().then(data => setCursos(data)).catch(() => {});
    }, []);

    useEffect(() => {
        if (!selectedCursoId) { setCurrentHorario(null); setDescripcion(''); return; }
        api.getHorarioCurso(parseInt(selectedCursoId))
            .then(data => {
                setCurrentHorario(data);
                setDescripcion(data?.descripcion || '');
            })
            .catch(() => {});
    }, [selectedCursoId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCursoId || !descripcion.trim()) {
            toast.error('Selecciona un curso e ingresa la descripción del horario');
            return;
        }

        setIsLoading(true);
        const formData = new FormData();
        formData.append('curso_id', selectedCursoId);
        formData.append('descripcion', descripcion.trim());
        if (file) formData.append('file', file);

        try {
            await api.saveHorario(formData);
            toast.success(currentHorario ? 'Horario actualizado ✅' : 'Horario guardado ✅');
            // Refresh
            const data = await api.getHorarioCurso(parseInt(selectedCursoId));
            setCurrentHorario(data);
            setFile(null);
            const fi = document.getElementById('horario-file') as HTMLInputElement;
            if (fi) fi.value = '';
        } catch (err: any) {
            toast.error(err.message || 'Error al guardar el horario');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8 max-w-3xl mx-auto pb-10">
            <div>
                <h1 className="text-3xl font-bold text-[#1e3a8a] mb-2">Horario del Curso</h1>
                <p className="text-gray-600">Publica el horario de clases para que tus estudiantes inscritos puedan verlo.</p>
            </div>

            <Card className="border-t-4 border-t-[#1e3a8a] shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl text-[#1e3a8a]">
                        <CalendarDays size={22} /> Configurar Horario
                    </CardTitle>
                    <CardDescription>
                        Escribe el horario en texto y opcionalmente adjunta una imagen del calendario.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label>Curso <span className="text-red-500">*</span></Label>
                            <Select value={selectedCursoId} onValueChange={setSelectedCursoId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona un curso..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {cursos.map(c => (
                                        <SelectItem key={c.id} value={c.id.toString()}>{c.nombre}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Descripción del Horario <span className="text-red-500">*</span></Label>
                            <textarea
                                value={descripcion}
                                onChange={e => setDescripcion(e.target.value)}
                                rows={5}
                                placeholder={'Ejemplo:\n• Lunes y Miércoles: 6:00pm - 8:00pm\n• Sábados: 9:00am - 12:00pm\n• Lugar: Aula 201 / Virtual via Zoom'}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="horario-file">Imagen del Horario (Opcional)</Label>
                            <input
                                id="horario-file"
                                type="file"
                                accept="image/*"
                                onChange={e => setFile(e.target.files?.[0] || null)}
                                className="w-full cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 text-sm text-gray-500"
                            />
                        </div>

                        <div className="flex justify-end pt-2 border-t border-gray-100">
                            <Button
                                type="submit"
                                disabled={isLoading || !selectedCursoId || !descripcion.trim()}
                                className="bg-[#1e3a8a] hover:bg-[#152960] flex items-center gap-2"
                            >
                                <Save size={16} />
                                {isLoading ? 'Guardando...' : (currentHorario ? 'Actualizar Horario' : 'Publicar Horario')}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Current Horario Preview */}
            {currentHorario && (
                <Card className="bg-blue-50/40 border border-blue-100">
                    <CardHeader>
                        <CardTitle className="text-base text-blue-800 flex items-center gap-2">
                            <CalendarDays size={18} /> Horario Publicado Actualmente
                        </CardTitle>
                        <CardDescription className="text-blue-600 text-xs">
                            Última actualización: {new Date(currentHorario.fecha_actualizacion).toLocaleString('es-ES')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed bg-white rounded-lg p-4 border border-blue-100">
                            {currentHorario.descripcion}
                        </pre>
                        {currentHorario.archivo_url && (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <ImageIcon size={14} />
                                    <span className="font-medium">Imagen adjunta:</span>
                                    <a
                                        href={`${MEDIA_URL}${currentHorario.archivo_url}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-blue-600 underline flex items-center gap-1 hover:text-blue-800"
                                    >
                                        Ver imagen <ExternalLink size={12} />
                                    </a>
                                </div>
                                <img
                                    src={`${MEDIA_URL}${currentHorario.archivo_url}`}
                                    alt="Horario del curso"
                                    className="max-h-64 rounded-lg border border-blue-100 object-contain w-full bg-white"
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
