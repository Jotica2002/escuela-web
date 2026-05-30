'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { FileText, Building2, ExternalLink, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

interface Solicitud {
    id: number;
    titulo: string;
    descripcion: string;
    requisitos: string;
    estado: string;
    dirigido_a: string;
    fecha_creacion: string;
}

export default function ConvenioSolicitudesPage() {
    const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await api.convenioGetSolicitudes();
            setSolicitudes(data);
            setError(null);
        } catch (err: any) {
            console.error(err);
            setError('Error al cargar solicitudes. ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleProponerCurso = (solicitud: Solicitud) => {
        // We navigate to /convenio/nueva and pass query parameters so it can pre-fill
        const urlParams = new URLSearchParams({
            solicitud_id: solicitud.id.toString(),
            titulo_sugerido: solicitud.titulo,
            descripcion_sugerida: solicitud.descripcion,
        });
        router.push(`/convenio/nueva?${urlParams.toString()}`);
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div></div>;
    }

    // Filter to only show active requests, optionally you can show closed ones too if needed
    const solicitudesAbiertas = solicitudes.filter(s => s.estado === 'abierta');

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                    <FileText className="text-emerald-600" /> Solicitudes del Administrador
                </h1>
                <p className="text-gray-500 mt-1">Revisa los cursos que la institución necesita y propone profesores para impartirlos.</p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg">
                    {error}
                </div>
            )}

            {solicitudesAbiertas.length === 0 ? (
                <Card className="border-dashed border-2 bg-gray-50">
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                        <Building2 className="w-12 h-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Sin solicitudes pendientes</h3>
                        <p className="text-gray-500 max-w-sm mb-6">
                            El administrador de la escuela no tiene solicitudes de cursos activas en este momento.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {solicitudesAbiertas.map((solicitud) => (
                        <Card key={solicitud.id} className="overflow-hidden hover:shadow-lg transition-shadow border-t-4 border-t-emerald-500 flex flex-col">
                            <CardHeader className="pb-3 flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full">
                                        <Clock size={12} />
                                        Pendiente
                                    </span>
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                                        {solicitud.dirigido_a}
                                    </span>
                                </div>
                                <CardTitle className="text-lg leading-tight mt-1">{solicitud.titulo}</CardTitle>
                                <CardDescription className="text-xs text-gray-400">
                                    Solicitado el {new Date(solicitud.fecha_creacion).toLocaleDateString()}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col flex-1 justify-between">
                                <div className="mb-6">
                                    <p className="text-sm text-gray-600 line-clamp-4">
                                        {solicitud.descripcion}
                                    </p>
                                    {solicitud.requisitos && (
                                        <div className="mt-3 p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                                            <p className="text-xs font-semibold text-blue-800 mb-1">Requisitos o Perfil</p>
                                            <p className="text-xs text-blue-700">{solicitud.requisitos}</p>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="pt-4 border-t border-gray-100 mt-auto">
                                    <button
                                        onClick={() => handleProponerCurso(solicitud)}
                                        className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
                                    >
                                        <ExternalLink size={16} />
                                        Proponer Curso
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
