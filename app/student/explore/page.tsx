'use client';

import { useState, useEffect } from 'react';
import { CourseCard } from '@/components/CourseCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { api } from '@/lib/api';

interface Course {
    id: string;
    nombre: string;
    descripcion?: string;
    imagen_url?: string;
}

export default function ExploreCoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoadingCourses, setIsLoadingCourses] = useState(true);

    useEffect(() => {
        loadCourses();
    }, []);

    const loadCourses = async () => {
        setIsLoadingCourses(true);
        try {
            const coursesData = await api.getAvailableCourses();
            setCourses(coursesData);
        } catch (error) {
            console.error('Error recargando cursos:', error);
        } finally {
            setIsLoadingCourses(false);
        }
    };

    const handleInscribe = () => {
        loadCourses(); // Refresh list to reflect the subscription status if needed
    };

    return (
        <main className="max-w-7xl mx-auto px-6 py-8">
            <section className="mb-10">
                <h1 className="text-3xl lg:text-4xl font-extrabold text-[#1e3a8a] mb-2 tracking-tight">
                    Explorar Cursos Disponibles
                </h1>
                <p className="text-gray-500 text-lg">
                    Descubre e inscríbete en nuestros cursos de emprendimiento para potenciar tus habilidades.
                </p>
            </section>

            <section>
                {isLoadingCourses ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <Skeleton className="h-48 rounded-xl" />
                        <Skeleton className="h-48 rounded-xl" />
                        <Skeleton className="h-48 rounded-xl" />
                    </div>
                ) : courses.length === 0 ? (
                    <Card className="text-center py-16 bg-white shadow-sm border-dashed border-2 border-gray-200 rounded-xl">
                        <p className="text-gray-500 text-lg">No hay cursos disponibles en este momento.</p>
                    </Card>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {courses.map((course) => (
                            <CourseCard
                                key={course.id}
                                id={course.id}
                                nombre={course.nombre}
                                descripcion={course.descripcion}
                                imagen_url={course.imagen_url}
                                onInscribe={handleInscribe}
                            />
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}
