'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileBadge, Download } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface Certificado {
  id: number;
  nombre_curso: string;
  archivo_url: string;
  fecha_subida: string;
}

export default function CertificatesPage() {
    const [certificados, setCertificados] = useState<Certificado[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        cargarCertificados();
    }, []);

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

    if (isLoading) {
        return <div className="p-8 flex justify-center"><div className="animate-spin h-8 w-8 border-4 border-[#1e3a8a] border-t-transparent rounded-full"></div></div>;
    }

    return (
        <main className="max-w-7xl mx-auto px-6 py-8">
            <section className="mb-10">
                <h1 className="text-3xl lg:text-4xl font-extrabold text-[#1e3a8a] mb-2 tracking-tight">
                    Mis Certificados
                </h1>
                <p className="text-gray-500 text-lg">
                    Aquí podrás descargar los certificados de los cursos que hayas aprobado.
                </p>
            </section>

            {certificados.length === 0 ? (
                <Card className="bg-white shadow-sm border border-gray-100 rounded-2xl overflow-hidden py-16">
                    <CardContent className="flex flex-col items-center justify-center text-center space-y-6">
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-[#1e3a8a] mb-2">
                            <FileBadge size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">
                            No tienes certificados disponibles.
                        </h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                            Cuando apruebes un curso de la Escuela de Emprendimiento y el administrador genere tu diploma, aparecerá aquí.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="mt-8 bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden relative">
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
                                            href={`http://127.0.0.1:5000${cert.archivo_url}`} 
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
        </main>
    );
}
