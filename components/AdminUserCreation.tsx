'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface AdminUserCreationProps {
    onUserCreated?: () => void;
}

export function AdminUserCreation({ onUserCreated }: AdminUserCreationProps) {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rol, setRol] = useState<'teacher' | 'convenio'>('teacher');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (password.length < 6) {
                throw new Error('La contraseña debe tener al menos 6 caracteres');
            }

            await api.crearUsuarioAdmin({
                nombre,
                email,
                password,
                rol
            });

            toast.success('Usuario registrado exitosamente');

            // Limpiar formulario
            setNombre('');
            setEmail('');
            setPassword('');
            setRol('teacher');

            if (onUserCreated) {
                onUserCreated();
            }

        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Error al crear el usuario');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle className="text-xl font-bold">Crear Usuario Privado</CardTitle>
                <CardDescription>
                    Registra manualmente a Profesores o personal de Convenio
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">

                    <div className="space-y-2">
                        <Label htmlFor="rol">Rol del Usuario</Label>
                        <select
                            id="rol"
                            value={rol}
                            onChange={(e) => setRol(e.target.value as 'teacher' | 'convenio')}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            required
                        >
                            <option value="teacher">Profesor</option>
                            <option value="convenio">Convenio</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="nombre">Nombre Completo</Label>
                        <Input
                            id="nombre"
                            type="text"
                            placeholder="Nombre del usuario"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="usuario@escuela.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Contraseña Provisional</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-red-600 hover:bg-red-700 text-white"
                    >
                        {isLoading ? 'Registrando...' : 'Registrar Cuenta'}
                    </Button>

                </form>
            </CardContent>
        </Card>
    );
}
