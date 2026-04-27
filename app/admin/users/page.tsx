'use client';

import { AdminUserCreation } from '@/components/AdminUserCreation';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { Users, Shield, Building2, UserCircle } from 'lucide-react';

interface Usuario {
    id: number;
    nombre: string;
    email: string;
    rol: string;
    creado_por_id: number | null;
    creado_por_nombre: string | null;
}

export default function AdminUsersPage() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const cargarUsuarios = async () => {
        setIsLoading(true);
        try {
            const data = await api.getAdminUsuarios();
            setUsuarios(data);
        } catch (error) {
            toast.error('Error al cargar la lista de usuarios');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        cargarUsuarios();
    }, []);

    // Function to pass to AdminUserCreation so it can refresh the list
    const handleUserCreated = () => {
        cargarUsuarios();
    };

    const getRoleBadge = (rol: string) => {
        switch (rol) {
            case 'admin':
                return <span className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 bg-red-100 text-red-800 rounded-full"><Shield size={12} /> Admin</span>;
            case 'convenio':
                return <span className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 bg-purple-100 text-purple-800 rounded-full"><Building2 size={12} /> Convenio</span>;
            case 'teacher':
            case 'profesor':
                return <span className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full"><UserCircle size={12} /> Profesor</span>;
            case 'student':
                return <span className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 bg-green-100 text-green-800 rounded-full">Estudiante</span>;
            default:
                return <span className="text-xs font-medium px-2.5 py-1 bg-gray-100 text-gray-800 rounded-full">{rol}</span>;
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-[#1e3a8a] mb-2">Gestión de Usuarios</h1>
                <p className="text-gray-600">Crea nuevos usuarios y administra el personal registrado por los convenios.</p>
            </div>

            <AdminUserCreation onUserCreated={handleUserCreated} />

            <Card className="shadow-sm mt-8 border-t-4 border-t-[#1e3a8a]">
                <CardHeader>
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                        <Users size={24} className="text-[#1e3a8a]" />
                        Directorio de Usuarios
                    </CardTitle>
                    <CardDescription>
                        Lista de profesores, convenios y administradores en el sistema.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="text-center py-8 text-gray-500">Cargando directorio...</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-6 py-4">Nombre Completo</th>
                                        <th className="px-6 py-4">Email</th>
                                        <th className="px-6 py-4">Rol</th>
                                        <th className="px-6 py-4">Creado Por</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {usuarios.filter(u => u.rol !== 'student').map((user) => (
                                        <tr key={user.id} className="border-b hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-900">{user.nombre}</td>
                                            <td className="px-6 py-4 text-gray-500">{user.email}</td>
                                            <td className="px-6 py-4">{getRoleBadge(user.rol)}</td>
                                            <td className="px-6 py-4">
                                                {user.creado_por_nombre ? (
                                                    <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                                                        {user.creado_por_nombre}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-gray-400 italic">Sistema</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {usuarios.filter(u => u.rol !== 'student').length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="text-center py-8 text-gray-500">
                                                No hay usuarios registrados (excluyendo estudiantes).
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
