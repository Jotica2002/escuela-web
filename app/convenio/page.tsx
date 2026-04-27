'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Building2, ThumbsUp, FilePlus, CheckCircle2, Clock } from 'lucide-react';
import Link from 'next/link';

interface Stats {
    total_propuestas: number;
    propuestas_pendientes: number;
    propuestas_aprobadas: number;
    total_votos_recibidos: number;
}

interface Propuesta {
    id: number;
    titulo: string;
    descripcion: string;
    votos: number;
    estado: string;
}

export default function ConvenioDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState<Stats | null>(null);
    const [propuestas, setPropuestas] = useState<Propuesta[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [statsData, propuestasData] = await Promise.all([
                api.convenioEstadisticas(),
                api.convenioMisPropuestas(),
            ]);
            setStats(statsData);
            setPropuestas(propuestasData.slice(0, 3)); // top 3 recent
        } catch {
            toast.error('Error cargando el dashboard');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { loadData(); }, [loadData]);

    const statCards = stats ? [
        { label: 'Propuestas Enviadas', value: stats.total_propuestas, icon: FilePlus, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'En Votación', value: stats.propuestas_pendientes, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
        { label: 'Aprobadas', value: stats.propuestas_aprobadas, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Votos Recibidos', value: stats.total_votos_recibidos, icon: ThumbsUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    ] : [];

    return (
        <div className="max-w-5xl mx-auto">
            {/* Welcome */}
            <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center">
                    <Building2 className="text-emerald-600" size={26} />
                </div>
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900">
                        Bienvenido, <span className="text-emerald-700">{user?.nombre}</span>
                    </h1>
                    <p className="text-gray-500 text-sm mt-0.5">Portal de institución con convenio · Escuela de Emprendimiento</p>
                </div>
            </div>

            {/* Stats */}
            {isLoading ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[1,2,3,4].map(i => <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />)}
                </div>
            ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {statCards.map(card => {
                        const Icon = card.icon;
                        return (
                            <div key={card.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                                <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>
                                    <Icon className={card.color} size={20} />
                                </div>
                                <p className="text-2xl font-extrabold text-gray-900">{card.value}</p>
                                <p className="text-xs text-gray-500 mt-0.5 font-medium">{card.label}</p>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Recent proposals + CTA */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Recent proposals */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-bold text-gray-800">Mis últimas propuestas</h2>
                        <Link href="/convenio/propuestas" className="text-xs text-emerald-600 hover:underline font-semibold">
                            Ver todas →
                        </Link>
                    </div>
                    {isLoading ? (
                        <div className="space-y-3">
                            {[1,2,3].map(i => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />)}
                        </div>
                    ) : propuestas.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">
                            <FilePlus className="mx-auto mb-2" size={32} />
                            <p className="text-sm">Aún no has creado propuestas</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {propuestas.map(p => (
                                <div key={p.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                    <div className="min-w-0 flex-1">
                                        <p className="font-semibold text-gray-800 text-sm truncate">{p.titulo}</p>
                                        <span className={`text-xs font-medium ${p.estado === 'aceptado' ? 'text-green-600' : 'text-yellow-600'}`}>
                                            {p.estado === 'aceptado' ? '✓ Aprobado' : '⏳ En votación'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1 text-emerald-600 font-bold text-sm ml-3">
                                        <ThumbsUp size={14} />
                                        {p.votos}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* CTA */}
                <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl shadow-sm p-6 flex flex-col justify-between text-white">
                    <div>
                        <h2 className="text-xl font-bold mb-2">¿Tienes una nueva idea de curso?</h2>
                        <p className="text-emerald-100 text-sm leading-relaxed">
                            Propón un curso para que los estudiantes puedan votarlo. 
                            El administrador tomará en cuenta los votos para aprobarlo.
                        </p>
                    </div>
                    <Link
                        href="/convenio/nueva"
                        className="mt-6 inline-flex items-center gap-2 bg-white text-emerald-700 hover:bg-emerald-50 px-5 py-3 rounded-xl text-sm font-bold transition-colors self-start shadow"
                    >
                        <FilePlus size={16} />
                        Crear nueva propuesta
                    </Link>
                </div>
            </div>
        </div>
    );
}
