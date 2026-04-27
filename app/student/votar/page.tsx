'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { ThumbsUp, Loader2, Users, BookOpen, Sparkles } from 'lucide-react';

interface CursoPropuesto {
    id: number;
    titulo: string;
    descripcion: string;
    instructor_tentativo: string;
    votos: number;
    votos_negativos: number;
    ya_vote: 'interesado' | 'no_interesado' | null;
    estado: string;
}

export default function VotarCursosPage() {
    const [propuestas, setPropuestas] = useState<CursoPropuesto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [votando, setVotando] = useState<number | null>(null);

    const loadPropuestas = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await api.getPropuestasVotacion();
            setPropuestas(data);
        } catch (err) {
            toast.error('No se pudieron cargar las propuestas');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadPropuestas();
    }, [loadPropuestas]);

    const handleVotar = async (cursoId: number, tipo: 'interesado' | 'no_interesado') => {
        setVotando(cursoId);
        try {
            const res = await api.votarCurso(cursoId, tipo);
            toast.success(tipo === 'interesado' ? '¡Tu interés ha sido registrado!' : '¡Gracias por compartir tu opinión!');
            // Update local state for instant feedback
            setPropuestas(prev =>
                prev.map(p =>
                    p.id === cursoId
                        ? { ...p, votos: res.votos, votos_negativos: res.votos_negativos, ya_vote: tipo }
                        : p
                )
            );
        } catch (err: any) {
            toast.error(err.message || 'Error al registrar tu voto');
        } finally {
            setVotando(null);
        }
    };

    return (
        <main className="max-w-7xl mx-auto px-6 py-8">
            {/* Header */}
            <section className="mb-10">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                        <Sparkles className="text-[#1e3a8a]" size={20} />
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-extrabold text-[#1e3a8a] tracking-tight">
                        Cursos que Quiero Ver
                    </h1>
                </div>
                <p className="text-gray-500 text-lg ml-1">
                    Comparte tu opinión sobre los temas propuestos para ayudarnos a decidir qué cursos crear a continuación.
                </p>
            </section>

            {/* Content */}
            {isLoading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-56 bg-gray-100 rounded-2xl animate-pulse" />
                    ))}
                </div>
            ) : propuestas.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-2xl">
                    <BookOpen className="mx-auto text-gray-300 mb-4" size={48} />
                    <p className="text-gray-500 text-lg font-medium">Aún no hay propuestas de cursos.</p>
                    <p className="text-gray-400 text-sm mt-1">¡Pronto el administrador añadirá opciones para votar!</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {propuestas.map(propuesta => (
                        <div
                            key={propuesta.id}
                            className={`bg-white rounded-2xl shadow-sm border-2 p-6 flex flex-col justify-between transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
                                propuesta.ya_vote === 'interesado' 
                                    ? 'border-blue-200 bg-blue-50/30' 
                                    : propuesta.ya_vote === 'no_interesado'
                                    ? 'border-red-100 bg-red-50/20'
                                    : 'border-gray-100'
                            }`}
                        >
                            {/* Card Top */}
                            <div className="mb-4">
                                <div className="flex items-start justify-between gap-2 mb-3">
                                    <h2 className="text-lg font-bold text-gray-800 leading-tight">
                                        {propuesta.titulo}
                                    </h2>
                                    {propuesta.ya_vote && (
                                        <span className={`shrink-0 text-xs font-semibold px-2 py-1 rounded-full ${
                                            propuesta.ya_vote === 'interesado' 
                                                ? 'text-blue-600 bg-blue-100' 
                                                : 'text-red-600 bg-red-100'
                                        }`}>
                                            {propuesta.ya_vote === 'interesado' ? 'Interesado' : 'No interesado'}
                                        </span>
                                    )}
                                </div>

                                {propuesta.descripcion && (
                                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                                        {propuesta.descripcion}
                                    </p>
                                )}

                                {propuesta.instructor_tentativo && (
                                    <div className="flex items-center gap-1.5 mt-3 text-gray-400 text-sm">
                                        <Users size={14} />
                                        <span>Instructor tentativo: <strong className="text-gray-600">{propuesta.instructor_tentativo}</strong></span>
                                    </div>
                                )}
                            </div>

                            {/* Card Bottom */}
                            <div className="pt-4 border-t border-gray-100 space-y-4">
                                <div className="flex items-center justify-between px-1">
                                    <div className="flex items-center gap-1.5 text-gray-500 text-sm font-semibold">
                                        <ThumbsUp size={14} className={propuesta.ya_vote === 'interesado' ? 'text-blue-500' : 'text-gray-400'} />
                                        <span className={propuesta.ya_vote === 'interesado' ? 'text-blue-600' : ''}>
                                            {propuesta.votos}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-gray-400 text-xs italic">
                                        <span>{propuesta.votos_negativos} no interesados</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => handleVotar(propuesta.id, 'interesado')}
                                        disabled={propuesta.ya_vote !== null || votando === propuesta.id}
                                        className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                                            propuesta.ya_vote === 'interesado'
                                                ? 'bg-blue-600 text-white shadow-inner'
                                                : propuesta.ya_vote === 'no_interesado'
                                                ? 'bg-gray-100 text-gray-300 cursor-default'
                                                : 'bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 active:scale-95'
                                        }`}
                                    >
                                        {votando === propuesta.id ? (
                                            <Loader2 size={14} className="animate-spin" />
                                        ) : (
                                            <ThumbsUp size={14} />
                                        )}
                                        Me interesa
                                    </button>

                                    <button
                                        onClick={() => handleVotar(propuesta.id, 'no_interesado')}
                                        disabled={propuesta.ya_vote !== null || votando === propuesta.id}
                                        className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                                            propuesta.ya_vote === 'no_interesado'
                                                ? 'bg-red-500 text-white shadow-inner'
                                                : propuesta.ya_vote === 'interesado'
                                                ? 'bg-gray-100 text-gray-300 cursor-default'
                                                : 'bg-white border-2 border-red-500 text-red-500 hover:bg-red-50 active:scale-95'
                                        }`}
                                    >
                                        No me interesa
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}
