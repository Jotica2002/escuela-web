'use client';

import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { api } from '@/lib/api';

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Camera } from 'lucide-react';
import Image from 'next/image';

const API_BASE_URL = 'http://127.0.0.1:5000'; // Define backend URL context

export default function ProfilePage() {
    const { user, updateUser } = useAuth();
    const [nombre, setNombre] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (user?.nombre) {
            setNombre(user.nombre);
        }
        if (user?.foto_perfil) {
            // Check if it's already a full URL or needs the base
            const avatarUrl = user.foto_perfil.startsWith('http') ? user.foto_perfil : `${API_BASE_URL}${user.foto_perfil}`;
            setPreviewUrl(avatarUrl);
        }
    }, [user]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Very basic size check (e.g. 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error("La imagen no debe superar los 5MB");
                return;
            }
            setSelectedFile(file);
            // Create a local blob URL for temporary preview
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        if (!nombre.trim()) {
            toast.error('El nombre no puede estar vacío');
            return;
        }

        setIsSaving(true);
        try {
            const formData = new FormData();
            formData.append('nombre', nombre);
            if (selectedFile) {
                formData.append('foto_perfil', selectedFile);
            }

            const response = await api.updateProfileImage(formData);

            // Assume the response returns the updated user inside a `user` key
            if (response && response.user) {
                updateUser(response.user);
            } else {
                updateUser({ nombre });
            }

            toast.success('Perfil actualizado correctamente');
            setSelectedFile(null); // Clear selected file after successful save
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Error al actualizar el perfil');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <main className="max-w-7xl mx-auto px-6 py-8">
            <section className="mb-10">
                <h1 className="text-3xl lg:text-4xl font-extrabold text-[#1e3a8a] mb-2 tracking-tight">
                    Mi Perfil
                </h1>
                <p className="text-gray-500 text-lg">
                    Gestiona tu información personal y credenciales de acceso.
                </p>
            </section>

            <div className="max-w-2xl">
                <Card className="bg-white shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
                    <CardHeader className="p-8 border-b border-gray-50 bg-gray-50/50">
                        <div className="flex flex-col sm:flex-row items-center gap-6">

                            {/* Avatar Picker */}
                            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                <div className="w-24 h-24 bg-[#1e3a8a] rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-inner overflow-hidden border-4 border-white transition-all group-hover:opacity-80">
                                    {previewUrl ? (
                                        <Image src={previewUrl} alt="Avatar" layout="fill" objectFit="cover" />
                                    ) : (
                                        <User size={40} />
                                    )}
                                </div>
                                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera size={24} className="text-white" />
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/png, image/jpeg, image/jpg"
                                    onChange={handleFileChange}
                                />
                            </div>

                            <div className="text-center sm:text-left">
                                <CardTitle className="text-2xl font-bold text-gray-900">{user?.nombre || 'Estudiante'}</CardTitle>
                                <CardDescription className="text-gray-500 text-base mt-1">
                                    {user?.rol === 'student' ? 'Estudiante de la Escuela' : 'Perfil de Sistema'}
                                </CardDescription>
                                {selectedFile && <span className="text-xs text-blue-600 font-semibold mt-2 inline-block">Nueva imagen seleccionada (sin guardar)</span>}
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-8 space-y-8">
                        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                            <div className="space-y-2">
                                <Label htmlFor="nombre" className="text-sm font-semibold text-gray-700">Nombre Completo</Label>
                                <Input
                                    id="nombre"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    className="h-12 border-gray-200 focus:border-[#1e3a8a] focus:ring-[#1e3a8a] rounded-xl"
                                    placeholder="Tu nombre completo"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Correo Electrónico</Label>
                                <Input
                                    id="email"
                                    defaultValue={user?.email || ''}
                                    type="email"
                                    disabled
                                    className="h-12 border-gray-200 bg-gray-50 text-gray-500 rounded-xl cursor-not-allowed"
                                />
                                <p className="text-xs text-gray-400 mt-1">El correo electrónico no puede ser modificado por el usuario.</p>
                            </div>

                            <div className="pt-4 border-t border-gray-100 mt-6 flex flex-col sm:flex-row gap-4">
                                <Button
                                    type="button"
                                    onClick={handleSave}
                                    disabled={isSaving || (!selectedFile && nombre === user?.nombre)}
                                    className="bg-[#f97316] hover:bg-[#ea580c] text-white px-6 h-11 rounded-xl font-medium shadow-sm transition-colors flex-1"
                                >
                                    {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}

