'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { BookX, CheckCircle, CalendarDays, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { api } from '@/lib/api';

interface Enrollment {
    inscripcion_id: number;
    fecha_inscripcion: string;
    curso: {
        id: number;
        nombre: string;
        descripcion: string;
        imagen_url?: string;
    };
}

interface Horario {
    descripcion: string;
    archivo_url: string | null;
    fecha_actualizacion: string;
}

function HorarioSection({ cursoId }: { cursoId: number }) {
    const [horario, setHorario] = useState<Horario | null>(null);
    const [loading, setLoading] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const toggleExpand = async () => {
        if (!expanded && !horario) {
            setLoading(true);
            try {
                const data = await api.getHorarioCurso(cursoId);
                setHorario(data);
            } catch {}
            setLoading(false);
        }
        setExpanded(e => !e);
    };

    return (
        <div className="mt-4 border-t border-gray-100 pt-3">
            <button
                onClick={toggleExpand}
                className="flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900 transition-colors"
            >
                <CalendarDays size={15} />
                Ver Horario
                {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>

            {expanded && (
                <div className="mt-3 rounded-lg bg-blue-50 border border-blue-100 p-4 space-y-3">
                    {loading ? (
                        <div className="text-xs text-gray-400 animate-pulse">Cargando horario...</div>
                    ) : !horario ? (
                        <p className="text-xs text-gray-400 italic">El profesor aún no ha publicado un horario para este curso.</p>
                    ) : (
                        <>
                            <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">
                                {horario.descripcion}
                            </pre>
                            {horario.archivo_url && (
                                <div className="space-y-2">
                                    <img
                                        src={`http://127.0.0.1:5000${horario.archivo_url}`}
                                        alt="Horario del curso"
                                        className="max-h-48 rounded-lg border border-blue-200 object-contain w-full bg-white"
                                    />
                                    <a
                                        href={`http://127.0.0.1:5000${horario.archivo_url}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-xs text-blue-600 underline flex items-center gap-1"
                                    >
                                        Ver imagen completa <ExternalLink size={11} />
                                    </a>
                                </div>
                            )}
                            <p className="text-xs text-gray-400">
                                Actualizado: {new Date(horario.fecha_actualizacion).toLocaleDateString('es-ES')}
                            </p>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default function MyCoursesPage() {
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchEnrollments = async () => {
            try {
                const data = await api.getMyEnrollments();
                setEnrollments(data);
            } catch (error) {
                console.error("Error fetching enrollments", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchEnrollments();
    }, []);

    return (
        <main className="max-w-7xl mx-auto px-6 py-8">
            <section className="mb-10">
                <h1 className="text-3xl lg:text-4xl font-extrabold text-[#1e3a8a] mb-2 tracking-tight">
                    Mis Cursos
                </h1>
                <p className="text-gray-500 text-lg">Administra y accede a los cursos en los que estás inscrito.</p>
            </section>

            {isLoading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Skeleton className="h-48 rounded-xl" />
                    <Skeleton className="h-48 rounded-xl" />
                </div>
            ) : enrollments.length === 0 ? (
                <Card className="bg-white shadow-sm border border-gray-100 rounded-2xl overflow-hidden py-16">
                    <CardContent className="flex flex-col items-center justify-center text-center space-y-6">
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-[#1e3a8a] mb-2">
                            <BookX size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">
                            Aún no estás inscrito en ningún curso.
                        </h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                            Explora nuestra oferta académica y comienza tu camino en el emprendimiento.
                        </p>
                        <Link href="/student/explore">
                            <Button className="mt-4 bg-[#f97316] hover:bg-[#ea580c] text-white px-8 h-12 rounded-xl font-semibold shadow-md inline-flex items-center">
                                Explorar oferta académica
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {enrollments.map((enrollment) => (
                        <Card key={enrollment.inscripcion_id} className="bg-white shadow-md border border-gray-100 rounded-xl hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col">
                            {enrollment.curso.imagen_url ? (
                                <div className="h-40 w-full overflow-hidden border-b border-gray-100 shrink-0">
                                    <img 
                                        src={`http://127.0.0.1:5000/uploads/${enrollment.curso.imagen_url}`} 
                                        alt={enrollment.curso.nombre} 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="h-40 w-full bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center justify-center border-b border-gray-100 shrink-0">
                                    <BookX size={40} className="text-blue-200" />
                                </div>
                            )}
                            <CardContent className="p-6 flex-1 flex flex-col">
                                <h3 className="text-xl font-bold text-[#1e3a8a] mb-2">{enrollment.curso.nombre}</h3>
                                {enrollment.curso.descripcion && (
                                    <p className="text-gray-500 line-clamp-2 mb-4">
                                        {enrollment.curso.descripcion}
                                    </p>
                                )}
                                <div className="flex items-center text-sm font-medium text-green-600 bg-green-50 px-3 py-1.5 rounded-lg w-fit">
                                    <CheckCircle size={16} className="mr-2" />
                                    Inscrito
                                </div>
                                {/* Horario section — lazy loaded on expand */}
                                <HorarioSection cursoId={enrollment.curso.id} />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </main>
    );
}
