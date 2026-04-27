'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Book } from 'lucide-react';
import { api } from '@/lib/api';

interface Course {
    id: number;
    nombre: string;
    descripcion: string;
    duracion: string;
    estado: string;
}

interface Student {
    id: number;
    nombre: string;
    email: string;
}

interface TeacherCourseCardProps {
    course: Course;
}

export function TeacherCourseCard({ course }: TeacherCourseCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [students, setStudents] = useState<Student[]>([]);
    const [isLoadingStudents, setIsLoadingStudents] = useState(false);

    const handleViewStudents = async () => {
        if (!isExpanded) {
            setIsLoadingStudents(true);
            try {
                const data = await api.getTeacherCourseStudents(course.id);
                setStudents(data);
            } catch (error) {
                console.error("Error fetching students", error);
            } finally {
                setIsLoadingStudents(false);
            }
        }
        setIsExpanded(!isExpanded);
    };

    return (
        <Card className="h-full bg-white shadow-md border border-gray-100 rounded-xl hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="p-6 pb-4">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-50 text-[#1e3a8a] rounded-lg">
                        <Book size={20} />
                    </div>
                    <CardTitle className="text-xl font-bold text-[#1e3a8a]">{course.nombre}</CardTitle>
                </div>
                {course.descripcion && <p className="text-gray-500 line-clamp-2 text-sm">{course.descripcion}</p>}
                {course.duracion && (
                    <div className="mt-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Duración: {course.duracion}
                    </div>
                )}
            </CardHeader>
            <CardContent className="px-6 pb-6">
                <Button
                    onClick={handleViewStudents}
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2 border-[#1e3a8a] text-[#1e3a8a] hover:bg-blue-50"
                >
                    <Users size={18} />
                    {isExpanded ? 'Ocultar Estudiantes' : 'Ver Estudiantes'}
                </Button>

                {isExpanded && (
                    <div className="mt-6 border-t border-gray-100 pt-4">
                        <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Users size={16} className="text-gray-400" />
                            Listado de Inscritos ({isLoadingStudents ? '...' : students.length})
                        </h4>

                        {isLoadingStudents ? (
                            <div className="space-y-2">
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        ) : students.length === 0 ? (
                            <div className="text-sm text-center text-gray-500 py-4 bg-gray-50 rounded-lg">
                                No hay estudiantes inscritos en este curso aún.
                            </div>
                        ) : (
                            <ul className="space-y-3">
                                {students.map((student) => (
                                    <li key={student.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                                        <div>
                                            <p className="font-semibold text-gray-800 text-sm">{student.nombre}</p>
                                            <p className="text-xs text-gray-500">{student.email}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
