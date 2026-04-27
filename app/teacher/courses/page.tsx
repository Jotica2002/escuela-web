'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, Users } from 'lucide-react';
import { api } from '@/lib/api';
import { TeacherCourseCard } from '@/components/TeacherCourseCard';

interface Course {
    id: number;
    nombre: string;
    descripcion: string;
    duracion: string;
    estado: string;
}

export default function TeacherCoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await api.getTeacherCourses();
                setCourses(data);
            } catch (error) {
                console.error("Error fetching courses", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourses();
    }, []);

    return (
        <main className="max-w-7xl mx-auto px-6 py-8">
            <header className="mb-10">
                <h1 className="text-3xl lg:text-4xl font-extrabold text-[#1e3a8a] mb-2 tracking-tight">
                    Mis Cursos Asignados
                </h1>
                <p className="text-gray-500 text-lg">
                    Gestiona los cursos que dictas y visualiza a los estudiantes inscritos.
                </p>
            </header>

            {isLoading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Skeleton className="h-64 rounded-xl" />
                    <Skeleton className="h-64 rounded-xl" />
                </div>
            ) : courses.length === 0 ? (
                <Card className="bg-white shadow-sm border border-gray-100 rounded-2xl overflow-hidden py-16">
                    <CardContent className="flex flex-col items-center justify-center text-center space-y-6">
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-[#1e3a8a] mb-2">
                            <BookOpen size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">
                            Aún no tienes cursos asignados.
                        </h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                            Cuando el administrador apruebe una de tus propuestas o te asigne un curso, aparecerá aquí.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {courses.map((course) => (
                        <TeacherCourseCard key={course.id} course={course} />
                    ))}
                </div>
            )}
        </main>
    );
}
