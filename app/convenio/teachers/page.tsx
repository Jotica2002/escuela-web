'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { UserPlus } from 'lucide-react';

export default function ConvenioCreateTeacherPage() {
    const [nombre, setNombre] = useState('');
    const [cedula, setCedula] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nombre || !email || !password) {
            toast.error('Nombre, correo electrónico y contraseña son obligatorios');
            return;
        }

        setIsSubmitting(true);
        try {
            await api.convenioCrearProfesor({
                nombre,
                cedula,
                email,
                password
            });
            toast.success('Profesor registrado exitosamente');
            
            // Limpiar formulario
            setNombre('');
            setCedula('');
            setEmail('');
            setPassword('');
        } catch (error: any) {
            toast.error(error.message || 'Error al registrar al profesor');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold text-[#1e3a8a] mb-2">Registro de Profesores</h1>
                <p className="text-gray-600">Añade al sistema a los profesores que imparten clases en tu institución.</p>
            </div>

            <Card className="border-t-4 border-t-emerald-600 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2 text-emerald-700">
                        <UserPlus size={24} /> Nuevo Profesor
                    </CardTitle>
                    <CardDescription>
                        Una vez registrado, el administrador podrá asignarle cursos a este profesor.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <Label htmlFor="nombre">Nombre Completo <span className="text-red-500">*</span></Label>
                                <Input 
                                    id="nombre" 
                                    placeholder="Ej. María Pérez" 
                                    value={nombre} 
                                    onChange={(e) => setNombre(e.target.value)} 
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="cedula">Cédula de Identidad</Label>
                                <Input 
                                    id="cedula" 
                                    placeholder="Ej. V-12345678" 
                                    value={cedula} 
                                    onChange={(e) => setCedula(e.target.value)} 
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Correo Electrónico <span className="text-red-500">*</span></Label>
                                <Input 
                                    id="email" 
                                    type="email"
                                    placeholder="profesor@ejemplo.com" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Contraseña Inicial <span className="text-red-500">*</span></Label>
                                <Input 
                                    id="password" 
                                    type="password"
                                    placeholder="******" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-gray-100">
                            <Button type="submit" disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700">
                                {isSubmitting ? 'Registrando...' : 'Registrar Profesor'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
