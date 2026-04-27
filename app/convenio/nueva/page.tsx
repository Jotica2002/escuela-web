'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { FilePlus, Loader2, ArrowLeft, UserCircle } from 'lucide-react';
import Link from 'next/link';

interface Profesor {
    id: number;
    nombre: string;
    email: string;
}

export default function NuevaPropuestaPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        titulo: '',
        descripcion: '',
        instructor_tentativo: '',
    });
    const [profesorId, setProfesorId] = useState<string>('');
    const [profesores, setProfesores] = useState<Profesor[]>([]);
    const [imagen, setImagen] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        api.convenioGetMyTeachers()
            .then(data => setProfesores(data))
            .catch(() => {});
    }, []);

    const handleProfesorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = e.target.value;
        setProfesorId(id);
        const profe = profesores.find(p => p.id.toString() === id);
        setForm(f => ({ ...f, instructor_tentativo: profe ? profe.nombre : '' }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.titulo.trim()) {
            toast.error('El título es obligatorio');
            return;
        }
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('titulo', form.titulo);
            if (form.descripcion) formData.append('descripcion', form.descripcion);
            if (form.instructor_tentativo) formData.append('instructor_tentativo', form.instructor_tentativo);
            if (imagen) formData.append('imagen', imagen);

            await api.convenioCrearPropuesta(formData);
            toast.success('¡Propuesta enviada! Los estudiantes ya pueden votarla 🎉');
            router.push('/convenio/propuestas');
        } catch (err: any) {
            toast.error(err.message || 'Error al crear la propuesta');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <Link
                    href="/convenio"
                    className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-emerald-700 mb-4 transition-colors"
                >
                    <ArrowLeft size={15} />
                    Volver al dashboard
                </Link>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                        <FilePlus className="text-emerald-600" size={20} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold text-gray-900">Nueva Propuesta de Curso</h1>
                        <p className="text-gray-500 text-sm">Una vez enviada, los estudiantes podrán votarla y el admin decidirá si aprobarla.</p>
                    </div>
                </div>
            </div>

            {/* Form Card */}
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-6">

                {/* Título */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Título del Curso <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={form.titulo}
                        onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 transition-all"
                        placeholder="Ej: Marketing Digital para Pequeñas Empresas"
                        maxLength={150}
                        required
                    />
                    <p className="text-xs text-gray-400 mt-1">{form.titulo.length}/150 caracteres</p>
                </div>

                {/* Descripción */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Descripción del Curso
                    </label>
                    <textarea
                        value={form.descripcion}
                        onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
                        rows={5}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 transition-all resize-none"
                        placeholder="Describe el objetivo del curso, los temas que cubrirá, a quién va dirigido..."
                    />
                </div>

                {/* Instructor */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
                        <UserCircle size={14} />
                        Profesor de tu institución que dictará el curso
                    </label>
                    {profesores.length === 0 ? (
                        <div className="w-full border border-dashed border-amber-300 bg-amber-50 rounded-xl px-4 py-3 text-sm text-amber-700">
                            No tienes profesores registrados aún.{' '}
                            <Link href="/convenio/teachers" className="font-bold underline">
                                Crea uno aquí
                            </Link>{' '}
                            primero.
                        </div>
                    ) : (
                        <select
                            value={profesorId}
                            onChange={handleProfesorChange}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 transition-all bg-white"
                        >
                            <option value="">-- Sin asignar (definir después) --</option>
                            {profesores.map(p => (
                                <option key={p.id} value={p.id.toString()}>
                                    {p.nombre} ({p.email})
                                </option>
                            ))}
                        </select>
                    )}
                    <p className="text-xs text-gray-500 mt-1">O escribe el nombre manualmente si aún no lo has registrado.</p>
                </div>

                {/* Imagen */}
                <div className="pt-4 border-t border-gray-100">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Imagen Representativa (Opcional)
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={e => setImagen(e.target.files?.[0] || null)}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                    />
                </div>

                {/* Info Box */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm text-emerald-800">
                    <strong>¿Qué pasa después?</strong>
                    <ul className="mt-2 space-y-1 text-emerald-700 list-disc list-inside">
                        <li>Los estudiantes verán tu propuesta y podrán votar por ella.</li>
                        <li>El administrador revisará los votos y decidirá si aprobar el curso.</li>
                        <li>Si es aprobado, el curso aparecerá en el catálogo oficial de la Escuela.</li>
                    </ul>
                </div>

                {/* Submit */}
                <div className="flex gap-3 pt-2">
                    <Link
                        href="/convenio"
                        className="flex-1 text-center py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-semibold transition-colors"
                    >
                        Cancelar
                    </Link>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white py-3 rounded-xl text-sm font-bold transition-colors shadow-sm"
                    >
                        {isLoading ? <Loader2 size={16} className="animate-spin" /> : <FilePlus size={16} />}
                        {isLoading ? 'Enviando...' : 'Enviar Propuesta'}
                    </button>
                </div>
            </form>
        </div>
    );
}
