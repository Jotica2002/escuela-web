'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileBadge, Download, Plus, X, Send, Paperclip, CheckCircle2 } from 'lucide-react';
import { api, MEDIA_URL } from '@/lib/api';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface Certificado {
  id: number;
  nombre_curso: string;
  archivo_url: string;
  fecha_subida: string;
}

export default function CertificatesPage() {
    const { user } = useAuth();
    const [certificados, setCertificados] = useState<Certificado[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // Solicitud form state
    const [profesion, setProfesion] = useState('');
    const [experiencia, setExperiencia] = useState('');
    const [emailContacto, setEmailContacto] = useState('');
    const [archivoEvidencia, setArchivoEvidencia] = useState<File | null>(null);
    const [isSending, setIsSending] = useState(false);
    const [enviado, setEnviado] = useState(false);

    useEffect(() => {
        cargarCertificados();
        // Pre-fill email if available
        if (user?.email) setEmailContacto(user.email);
    }, [user]);

    const cargarCertificados = async () => {
        try {
            const data = await api.getMisCertificados();
            setCertificados(data);
        } catch (error) {
            toast.error('Error al cargar tus certificados');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmitSolicitud = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profesion.trim() || !experiencia.trim() || !emailContacto.trim()) {
            toast.error('Por favor completa todos los campos obligatorios');
            return;
        }
        setIsSending(true);
        try {
            const formData = new FormData();
            formData.append('profesion', profesion);
            formData.append('experiencia', experiencia);
            formData.append('email_contacto', emailContacto);
            if (archivoEvidencia) formData.append('file', archivoEvidencia);

            await api.studentSolicitarCertificado(formData);
            setEnviado(true);
            toast.success('¡Solicitud enviada! El administrador se pondrá en contacto contigo.');
        } catch (error: any) {
            toast.error(error.message || 'Error al enviar la solicitud');
        } finally {
            setIsSending(false);
        }
    };

    const resetForm = () => {
        setProfesion('');
        setExperiencia('');
        setEmailContacto(user?.email || '');
        setArchivoEvidencia(null);
        setEnviado(false);
        setShowForm(false);
    };

    if (isLoading) {
        return <div className="p-8 flex justify-center"><div className="animate-spin h-8 w-8 border-4 border-[#1e3a8a] border-t-transparent rounded-full"></div></div>;
    }

    return (
        <main className="max-w-5xl mx-auto px-6 py-8 space-y-10">
            {/* Header */}
            <section className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="text-3xl lg:text-4xl font-extrabold text-[#1e3a8a] mb-2 tracking-tight">
                        Mis Certificados
                    </h1>
                    <p className="text-gray-500 text-base">
                        Descarga tus certificados de cursos o solicita uno por tu experiencia profesional.
                    </p>
                </div>
                <Button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 bg-[#1e3a8a] hover:bg-[#152960] text-white shadow-md"
                >
                    {showForm ? <X size={16} /> : <Plus size={16} />}
                    {showForm ? 'Cancelar' : 'Solicitar Certificado por Experiencia'}
                </Button>
            </section>

            {/* Solicitud Form */}
            {showForm && (
                <Card className="border-2 border-[#1e3a8a]/20 shadow-lg rounded-2xl overflow-hidden">
                    <div className="bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] px-6 py-4">
                        <h2 className="text-white font-bold text-lg flex items-center gap-2">
                            <FileBadge size={20} />
                            Solicitar Certificado de Conocimiento
                        </h2>
                        <p className="text-blue-100 text-sm mt-1">
                            La Escuela de Emprendimiento evaluará tu solicitud y se pondrá en contacto contigo.
                        </p>
                    </div>

                    {enviado ? (
                        <CardContent className="py-12 flex flex-col items-center text-center gap-4">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle2 size={40} className="text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">¡Solicitud Enviada!</h3>
                            <p className="text-gray-500 max-w-md">
                                Tu solicitud de certificado para <strong>"{profesion}"</strong> ha sido enviada al administrador. 
                                Recibirás una respuesta en tu correo: <strong>{emailContacto}</strong>.
                            </p>
                            <Button variant="outline" onClick={resetForm} className="mt-2">
                                Cerrar
                            </Button>
                        </CardContent>
                    ) : (
                        <CardContent className="py-6">
                            <form onSubmit={handleSubmitSolicitud} className="space-y-5">
                                <div className="grid md:grid-cols-2 gap-5">
                                    {/* Profesión */}
                                    <div className="space-y-2">
                                        <Label htmlFor="profesion" className="font-semibold text-gray-700">
                                            Profesión / Habilidad <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="profesion"
                                            placeholder="Ej: Electricista, Plomero, Carpintero..."
                                            value={profesion}
                                            onChange={e => setProfesion(e.target.value)}
                                            className="focus-visible:ring-[#1e3a8a]"
                                            required
                                        />
                                    </div>
                                    {/* Correo */}
                                    <div className="space-y-2">
                                        <Label htmlFor="email_contacto" className="font-semibold text-gray-700">
                                            Correo de Contacto <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="email_contacto"
                                            type="email"
                                            placeholder="tucorreo@ejemplo.com"
                                            value={emailContacto}
                                            onChange={e => setEmailContacto(e.target.value)}
                                            className="focus-visible:ring-[#1e3a8a]"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Experiencia */}
                                <div className="space-y-2">
                                    <Label htmlFor="experiencia" className="font-semibold text-gray-700">
                                        Descripción de tu Experiencia y Conocimientos <span className="text-red-500">*</span>
                                    </Label>
                                    <textarea
                                        id="experiencia"
                                        rows={5}
                                        placeholder="Describe tu experiencia, cuántos años llevas ejerciendo, qué trabajos has realizado, en qué empresa trabajas o trabajaste, cualquier detalle que avale tus conocimientos..."
                                        value={experiencia}
                                        onChange={e => setExperiencia(e.target.value)}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/30 resize-none"
                                        required
                                    />
                                </div>

                                {/* Archivo de Evidencia */}
                                <div className="space-y-2">
                                    <Label htmlFor="evidencia" className="font-semibold text-gray-700">
                                        Archivo de Evidencia (Opcional)
                                    </Label>
                                    <p className="text-xs text-gray-400">Puedes adjuntar fotos de tu trabajo, constancias, diplomas u otros documentos como prueba.</p>
                                    <div className="flex items-center gap-3">
                                        <label
                                            htmlFor="evidencia"
                                            className="flex items-center gap-2 cursor-pointer px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-[#1e3a8a] hover:text-[#1e3a8a] transition-colors"
                                        >
                                            <Paperclip size={16} />
                                            {archivoEvidencia ? archivoEvidencia.name : 'Seleccionar archivo...'}
                                        </label>
                                        <input
                                            id="evidencia"
                                            type="file"
                                            accept="image/*,.pdf,.doc,.docx"
                                            className="hidden"
                                            onChange={e => setArchivoEvidencia(e.target.files?.[0] || null)}
                                        />
                                        {archivoEvidencia && (
                                            <button type="button" onClick={() => setArchivoEvidencia(null)} className="text-red-400 hover:text-red-600">
                                                <X size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setShowForm(false)}
                                        className="flex-1"
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isSending}
                                        className="flex-1 bg-[#1e3a8a] hover:bg-[#152960] text-white flex items-center gap-2"
                                    >
                                        <Send size={16} />
                                        {isSending ? 'Enviando...' : 'Enviar Solicitud'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    )}
                </Card>
            )}

            {/* Certificados de Cursos */}
            <section>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Certificados de Cursos</h2>
                {certificados.length === 0 ? (
                    <Card className="bg-white shadow-sm border border-gray-100 rounded-2xl overflow-hidden py-14">
                        <CardContent className="flex flex-col items-center justify-center text-center space-y-6">
                            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-[#1e3a8a] mb-2">
                                <FileBadge size={40} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">
                                No tienes certificados de cursos aún.
                            </h3>
                            <p className="text-gray-500 max-w-md mx-auto">
                                Cuando apruebes un curso de la Escuela de Emprendimiento y el administrador genere tu diploma, aparecerá aquí.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-100/50">
                                <tr>
                                    <th scope="col" className="px-6 py-4 font-semibold">Curso</th>
                                    <th scope="col" className="px-6 py-4 font-semibold text-center">Fecha de Emisión</th>
                                    <th scope="col" className="px-6 py-4 font-semibold text-center">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {certificados.map((cert) => (
                                    <tr key={cert.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {cert.nombre_curso}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {new Date(cert.fecha_subida).toLocaleDateString('es-ES')}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <a
                                                href={`${MEDIA_URL}${cert.archivo_url}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-[#1e3a8a] hover:bg-blue-100 font-medium rounded-lg transition-colors"
                                            >
                                                <Download size={16} /> Descargar
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </main>
    );
}
