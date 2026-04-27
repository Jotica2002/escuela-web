'use client';

import React, { useState, useEffect } from 'react';
import { ApprovedCourses } from '@/components/ApprovedCourses';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { User } from '@/contexts/AuthContext';
import { BookPlus } from 'lucide-react';

export default function AdminCoursesPage() {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [duracion, setDuracion] = useState('');
    const [profesorId, setProfesorId] = useState('');
    const [imagen, setImagen] = useState<File | null>(null);
    
    const [profesores, setProfesores] = useState<User[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Key to force reload of the ApprovedCourses component
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        cargarProfesores();
    }, []);

    const cargarProfesores = async () => {
        try {
            const usuarios = await api.getAdminUsuarios();
            // Admin can assign courses to teachers, convenios or themselves (admin)
            const elegibles = usuarios.filter((u: User) => ['teacher', 'profesor', 'convenio', 'admin'].includes(u.rol));
            setProfesores(elegibles);
        } catch (error) {
            toast.error('Error al cargar la lista de profesores/personal');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nombre || !profesorId) {
            toast.error('El nombre y el profesor asignado son obligatorios');
            return;
        }

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('nombre', nombre);
            formData.append('descripcion', descripcion);
            formData.append('duracion', duracion);
            formData.append('profesor_id', profesorId);
            if (imagen) {
                formData.append('imagen', imagen);
            }

            await api.adminCrearCurso(formData);
            toast.success('Curso creado exitosamente');
            
            // Reset form
            setNombre('');
            setDescripcion('');
            setDuracion('');
            setProfesorId('');
            setImagen(null);
            
            // Reload the list below
            setReloadKey(prev => prev + 1); 
        } catch (error: any) {
            toast.error(error.message || 'Error al crear curso');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-3xl font-bold text-[#1e3a8a] mb-2">Creación y Gestión de Cursos</h1>
                <p className="text-gray-600">Añade nuevos cursos al catálogo y visualiza los que ya están activos.</p>
            </div>

            <Card className="border-t-4 border-t-[#1e3a8a] shadow-sm">
                <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2 text-[#1e3a8a]">
                        <BookPlus size={24} /> Crear Nuevo Curso
                    </CardTitle>
                    <CardDescription>
                        Crea un curso directamente desde la administración sin requerir propuestas previas.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="nombre">Nombre del Curso <span className="text-red-500">*</span></Label>
                                <Input 
                                    id="nombre" 
                                    placeholder="Ej. Programación Avanzada" 
                                    value={nombre} 
                                    onChange={(e) => setNombre(e.target.value)} 
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="profesor">Profesor / Instructor <span className="text-red-500">*</span></Label>
                                <Select value={profesorId} onValueChange={setProfesorId}>
                                    <SelectTrigger id="profesor">
                                        <SelectValue placeholder="Seleccionar instructor..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {profesores.map(prof => {
                                            const roleLabel = prof.rol === 'admin' ? 'Administrador' : prof.rol;
                                            const creatorLabel = prof.creado_por_nombre ? ` - Creado por: ${prof.creado_por_nombre}` : '';
                                            return (
                                                <SelectItem key={prof.id} value={prof.id.toString()}>
                                                    {prof.nombre} ({roleLabel}{creatorLabel})
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="descripcion">Descripción</Label>
                                <Input 
                                    id="descripcion" 
                                    placeholder="Breve descripción de lo que se enseñará en el curso..." 
                                    value={descripcion} 
                                    onChange={(e) => setDescripcion(e.target.value)} 
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="duracion">Duración Estimada</Label>
                                <Input 
                                    id="duracion" 
                                    placeholder="Ej. 4 semanas, 20 horas..." 
                                    value={duracion} 
                                    onChange={(e) => setDuracion(e.target.value)} 
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="imagen">Imagen Representativa del Curso (Opcional)</Label>
                                <Input 
                                    id="imagen" 
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setImagen(e.target.files?.[0] || null)} 
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={isSubmitting} className="bg-[#1e3a8a] hover:bg-[#152960]">
                                {isSubmitting ? 'Creando curso...' : 'Crear Curso Oficial'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <div className="pt-6 border-t border-gray-200">
                <ApprovedCourses key={reloadKey} />
            </div>
        </div>
    );
}
