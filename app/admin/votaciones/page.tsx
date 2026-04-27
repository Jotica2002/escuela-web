'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { ThumbsUp, CheckCircle2, Loader2, Plus, X, TrendingUp, UserCircle } from 'lucide-react';

interface CursoPropuesto {
    id: number;
    titulo: string;
    descripcion: string;
    instructor_tentativo: string;
    votos: number;
    votos_negativos: number;
    estado: string;
}

interface Profesor {
    id: number;
    nombre: string;
    rol: string;
    creado_por_nombre?: string | null;
}

export default function AdminVotacionesPage() {
    const [propuestas, setPropuestas] = useState<CursoPropuesto[]>([]);
    const [profesores, setProfesores] = useState<Profesor[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [aprobando, setAprobando] = useState<number | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [creating, setCreating] = useState(false);
    const [form, setForm] = useState({ titulo: '', descripcion: '', instructor_tentativo: '' });

    // Modal state for assigning professor on approval
    const [approvalModal, setApprovalModal] = useState<{ propuesta: CursoPropuesto } | null>(null);
    const [selectedProfesorId, setSelectedProfesorId] = useState<string>('');

    const loadPropuestas = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await api.adminGetPropuestasVotacion();
            setPropuestas(data);
        } catch {
            toast.error('No se pudieron cargar las propuestas');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { loadPropuestas(); }, [loadPropuestas]);

    useEffect(() => {
        api.getAdminUsuarios()
            .then((data: Profesor[]) => {
                const profs = data.filter((u: Profesor) => u.rol === 'teacher' || u.rol === 'profesor' || u.rol === 'admin');
                setProfesores(profs);
            })
            .catch(() => {});
    }, []);

    const openApprovalModal = (p: CursoPropuesto) => {
        setApprovalModal({ propuesta: p });
        setSelectedProfesorId('');
    };

    const handleConfirmAprobar = async () => {
        if (!approvalModal) return;
        const { propuesta } = approvalModal;
        setAprobando(propuesta.id);
        try {
            const profId = selectedProfesorId ? parseInt(selectedProfesorId) : undefined;
            await api.adminAprobarCursoPropuesto(propuesta.id, profId);
            toast.success('Curso aprobado y creado en el catálogo oficial ✅');
            setApprovalModal(null);
            loadPropuestas();
        } catch (err: any) {
            toast.error(err.message || 'Error al aprobar');
        } finally {
            setAprobando(null);
        }
    };

    const handleCrear = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.titulo.trim()) { toast.error('El título es obligatorio'); return; }
        setCreating(true);
        try {
            await api.adminCrearPropuestaVotacion(form);
            toast.success('Propuesta creada exitosamente');
            setForm({ titulo: '', descripcion: '', instructor_tentativo: '' });
            setShowForm(false);
            loadPropuestas();
        } catch (err: any) {
            toast.error(err.message || 'Error al crear la propuesta');
        } finally {
            setCreating(false);
        }
    };

    const pendientes = propuestas.filter(p => p.estado === 'pendiente');
    const aceptadas = propuestas.filter(p => p.estado === 'aceptado');

    return (
        <div className="max-w-6xl mx-auto">
            {/* Approval Modal */}
            {approvalModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-5">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-900">Aprobar Curso</h2>
                            <button onClick={() => setApprovalModal(null)} className="text-gray-400 hover:text-gray-700">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4">
                            <p className="font-semibold text-gray-800">{approvalModal.propuesta.titulo}</p>
                            {approvalModal.propuesta.instructor_tentativo && (
                                <p className="text-xs text-gray-500 mt-1">Instructor sugerido por el convenio: <strong>{approvalModal.propuesta.instructor_tentativo}</strong></p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700 flex items-center gap-1">
                                <UserCircle size={15} />
                                Asignar Profesor al Curso
                            </label>
                            <select
                                value={selectedProfesorId}
                                onChange={(e) => setSelectedProfesorId(e.target.value)}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 bg-white"
                            >
                                <option value="">-- Sin asignar por ahora --</option>
                                {profesores.map(prof => {
                                    const rolLabel = prof.rol === 'admin' ? 'Admin' : 'Profesor';
                                    const creadoPor = prof.creado_por_nombre ? ` · Convenio: ${prof.creado_por_nombre}` : '';
                                    return (
                                        <option key={prof.id} value={prof.id.toString()}>
                                            {prof.nombre} ({rolLabel}{creadoPor})
                                        </option>
                                    );
                                })}
                            </select>
                            <p className="text-xs text-gray-400">Si no asignas un profesor ahora, podrás hacerlo después desde "Crear Curso".</p>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => setApprovalModal(null)}
                                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleConfirmAprobar}
                                disabled={aprobando !== null}
                                className="flex-1 flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
                            >
                                {aprobando !== null ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle2 size={15} />}
                                Confirmar Aprobación
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="text-red-600" size={22} />
                        <h1 className="text-2xl font-extrabold text-gray-900">Gestión de Votaciones</h1>
                    </div>
                    <p className="text-gray-500 text-sm">Analiza el interés de los estudiantes para priorizar contenido.</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm"
                >
                    {showForm ? <X size={16} /> : <Plus size={16} />}
                    {showForm ? 'Cancelar' : 'Nueva Propuesta'}
                </button>
            </div>

            {/* Create form */}
            {showForm && (
                <form onSubmit={handleCrear} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8 space-y-4">
                    <h2 className="font-bold text-gray-800 mb-2">Crear nueva propuesta de votación</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="md:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Título del curso *</label>
                            <input
                                type="text"
                                value={form.titulo}
                                onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400"
                                placeholder="Ej: Marketing Digital para Emprendedores"
                            />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Instructor Tentativo</label>
                            <input
                                type="text"
                                value={form.instructor_tentativo}
                                onChange={e => setForm(f => ({ ...f, instructor_tentativo: e.target.value }))}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400"
                                placeholder="Nombre completo"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                        <textarea
                            value={form.descripcion}
                            onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
                            rows={3}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400 resize-none"
                            placeholder="Describe el curso brevemente..."
                        />
                    </div>
                    <div className="flex justify-end">
                        <button type="submit" disabled={creating} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-md">
                            {creating ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
                            Publicar para votación
                        </button>
                    </div>
                </form>
            )}

            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />)}
                </div>
            ) : (
                <>
                    {/* Tabla Pendientes */}
                    <section className="mb-10">
                        <h2 className="text-base font-bold text-gray-700 mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" />
                            Propuestas en Votación Activa ({pendientes.length})
                        </h2>
                        {pendientes.length === 0 ? (
                            <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-3xl text-gray-400 bg-gray-50/50">
                                <TrendingUp size={40} className="mx-auto mb-3 opacity-20" />
                                <p className="font-medium italic">No hay propuestas activas en este momento.</p>
                            </div>
                        ) : (
                            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden ring-1 ring-black/5">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-gray-50/80 border-b border-gray-100 italic">
                                                <th className="text-left px-6 py-4 font-bold text-gray-500 uppercase tracking-wider">Propuesta del Curso</th>
                                                <th className="text-center px-6 py-4 font-bold text-gray-500 uppercase tracking-wider">Interés Positivo</th>
                                                <th className="text-center px-6 py-4 font-bold text-gray-500 uppercase tracking-wider">No Interesados</th>
                                                <th className="text-center px-6 py-4 font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">% Opinión</th>
                                                <th className="text-center px-6 py-4 font-bold text-gray-500 uppercase tracking-wider">Decisión</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {pendientes.map((p, idx) => {
                                                const total = p.votos + p.votos_negativos;
                                                const percentage = total > 0 ? Math.round((p.votos / total) * 100) : 0;
                                                return (
                                                    <tr key={p.id} className="hover:bg-gray-50/80 transition-colors group">
                                                        <td className="px-6 py-5">
                                                            <div className="flex items-center gap-4">
                                                                <span className="text-lg font-black text-gray-100 group-hover:text-gray-200 transition-colors w-8">0{idx + 1}</span>
                                                                <div>
                                                                    <p className="font-bold text-gray-900 text-base">{p.titulo}</p>
                                                                    <p className="text-gray-400 text-xs mt-1">Instructor sugerido: {p.instructor_tentativo || 'Sin asignar'}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5 text-center">
                                                            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full font-black text-lg shadow-sm border border-blue-100 transition-transform group-hover:scale-110">
                                                                <ThumbsUp size={16} />
                                                                {p.votos}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5 text-center">
                                                            <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-3 py-1.5 rounded-full font-bold text-lg border border-red-100 opacity-80 group-hover:opacity-100 transition-opacity">
                                                                <X size={16} strokeWidth={3} />
                                                                {p.votos_negativos}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5 text-center hidden lg:table-cell">
                                                            <div className="flex flex-col items-center gap-1">
                                                                <span className={`text-xs font-black p-1 rounded ${percentage > 70 ? 'text-green-600' : percentage > 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                                                                    {percentage}% A favor
                                                                </span>
                                                                <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                                    <div className={`h-full rounded-full ${percentage > 70 ? 'bg-green-500' : percentage > 40 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${percentage}%` }} />
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5 text-center">
                                                            <button
                                                                onClick={() => openApprovalModal(p)}
                                                                disabled={aprobando === p.id}
                                                                className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-2xl text-xs font-black transition-all hover:shadow-lg disabled:opacity-50"
                                                            >
                                                                {aprobando === p.id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                                                                Aprobar Curso
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Tabla Aceptados */}
                    {aceptadas.length > 0 && (
                        <section>
                            <h2 className="text-base font-bold text-gray-700 mb-3 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
                                Historial de Propuestas Exitosas ({aceptadas.length})
                            </h2>
                            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-gray-50/50 border-b border-gray-100">
                                            <th className="text-left px-6 py-3 font-semibold text-gray-500 uppercase text-[10px]">Título del Curso</th>
                                            <th className="text-center px-6 py-3 font-semibold text-gray-500 uppercase text-[10px]">Interés Logrado</th>
                                            <th className="text-center px-6 py-3 font-semibold text-gray-500 uppercase text-[10px]">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {aceptadas.map(p => (
                                            <tr key={p.id} className="hover:bg-gray-50/30">
                                                <td className="px-6 py-4 font-bold text-gray-700">{p.titulo}</td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="flex items-center justify-center gap-1.5 text-blue-600 font-black">
                                                        <ThumbsUp size={14} />
                                                        {p.votos}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="bg-green-50 text-green-700 text-xs font-black px-3 py-1.5 rounded-full ring-1 ring-green-100">
                                                        CURSO INTEGRADO ✓
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    )}
                </>
            )}
        </div>
    );
}
