'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { FileText, Plus, X, Building2, CheckCircle2, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Convenio {
    id: number;
    nombre: string;
}

interface Solicitud {
    id: number;
    titulo: string;
    descripcion: string;
    requisitos: string;
    estado: string;
    convenio_id: number | null;
    convenio_nombre: string;
    fecha_creacion: string;
}

export default function AdminSolicitudesPage() {
    const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
    const [convenios, setConvenios] = useState<Convenio[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        requisitos: '',
        convenio_id: '',
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [solicitudesRes, conveniosRes] = await Promise.all([
                api.adminGetSolicitudes(),
                api.adminGetConvenios()
            ]);
            setSolicitudes(solicitudesRes);
            setConvenios(conveniosRes);
            setError(null);
        } catch (err: any) {
            console.error(err);
            setError('Error al cargar datos. ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSolicitud = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = {
                titulo: formData.titulo,
                descripcion: formData.descripcion,
                requisitos: formData.requisitos,
                convenio_id: formData.convenio_id ? parseInt(formData.convenio_id) : null,
            };
            await api.adminCreateSolicitud(payload);
            setIsModalOpen(false);
            setFormData({ titulo: '', descripcion: '', requisitos: '', convenio_id: '' });
            await loadData();
        } catch (err: any) {
            alert('Error al crear: ' + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleCerrarSolicitud = async (id: number) => {
        if (!confirm('¿Seguro que deseas cerrar esta solicitud? Ya no aparecerá como pendiente para los convenios.')) return;
        try {
            await api.adminUpdateSolicitudEstado(id, 'cerrada');
            await loadData();
        } catch (err: any) {
            alert('Error al cerrar solicitud: ' + err.message);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1e3a8a]"></div></div>;
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[#1e3a8a] flex items-center gap-2">
                        <FileText className="text-red-600" /> Solicitudes a Convenios
                    </h1>
                    <p className="text-gray-500 mt-1">Solicita cursos específicos a las instituciones con convenio.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                >
                    <Plus size={20} />
                    Nueva Solicitud
                </button>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg">
                    {error}
                </div>
            )}

            {solicitudes.length === 0 ? (
                <Card className="border-dashed border-2 bg-gray-50">
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                        <Building2 className="w-12 h-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Sin Solicitudes</h3>
                        <p className="text-gray-500 max-w-sm mb-6">
                            Aún no has creado ninguna solicitud de curso. Las solicitudes permiten a los convenios saber qué cursos necesita la escuela.
                        </p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Crear mi primera solicitud
                        </button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {solicitudes.map((solicitud) => (
                        <Card key={solicitud.id} className={`overflow-hidden transition-all hover:shadow-md ${solicitud.estado === 'cerrada' ? 'opacity-70 grayscale-[0.3]' : ''}`}>
                            <div className={`h-2 w-full ${solicitud.estado === 'abierta' ? 'bg-emerald-500' : 'bg-gray-400'}`}></div>
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${solicitud.estado === 'abierta' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {solicitud.estado === 'abierta' ? <Clock size={12} /> : <CheckCircle2 size={12} />}
                                        {solicitud.estado.toUpperCase()}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {new Date(solicitud.fecha_creacion).toLocaleDateString()}
                                    </span>
                                </div>
                                <CardTitle className="text-lg line-clamp-2" title={solicitud.titulo}>{solicitud.titulo}</CardTitle>
                                <CardDescription className="flex items-center gap-1 text-xs font-medium text-[#1e3a8a] mt-1">
                                    <Building2 size={12} />
                                    {solicitud.convenio_nombre}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-600 line-clamp-3 mb-4 h-[60px]" title={solicitud.descripcion}>
                                    {solicitud.descripcion}
                                </p>
                                
                                {solicitud.estado === 'abierta' && (
                                    <div className="pt-4 border-t border-gray-100 flex justify-end">
                                        <button
                                            onClick={() => handleCerrarSolicitud(solicitud.id)}
                                            className="text-xs font-semibold text-gray-500 hover:text-red-600 transition-colors"
                                        >
                                            Cerrar Solicitud
                                        </button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Modal Nueva Solicitud */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h2 className="text-xl font-bold text-[#1e3a8a] flex items-center gap-2">
                                <FileText size={20} className="text-red-600" />
                                Nueva Solicitud a Convenios
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            <form id="solicitudForm" onSubmit={handleCreateSolicitud} className="space-y-4">
                                
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Dirigida a</label>
                                    <select
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                        value={formData.convenio_id}
                                        onChange={(e) => setFormData({ ...formData, convenio_id: e.target.value })}
                                    >
                                        <option value="">A TODOS los convenios (General)</option>
                                        {convenios.map((c) => (
                                            <option key={c.id} value={c.id}>{c.nombre}</option>
                                        ))}
                                    </select>
                                    <p className="text-xs text-gray-500 mt-1">Puedes enviar esta solicitud a todas las instituciones o a una en específico.</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Título del Curso Solicitado</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                        placeholder="Ej: Curso de Finanzas para Emprendedores"
                                        value={formData.titulo}
                                        onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Descripción y Objetivos</label>
                                    <textarea
                                        required
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                                        placeholder="Explica de qué trata el curso y por qué se necesita..."
                                        value={formData.descripcion}
                                        onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Requisitos o Perfil Esperado (Opcional)</label>
                                    <textarea
                                        rows={2}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                                        placeholder="Ej: Se espera que el profesor tenga maestría, duración sugerida de 8 semanas, etc."
                                        value={formData.requisitos}
                                        onChange={(e) => setFormData({ ...formData, requisitos: e.target.value })}
                                    />
                                </div>
                            </form>
                        </div>

                        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                form="solicitudForm"
                                disabled={submitting}
                                className="px-6 py-2 bg-[#1e3a8a] text-white font-medium rounded-lg hover:bg-blue-900 transition-colors disabled:opacity-70 flex items-center gap-2"
                            >
                                {submitting && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                                Enviar Solicitud
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
