'use client';

import { useState, useEffect, useCallback } from 'react';
import { api, MEDIA_URL } from '@/lib/api';
import { toast } from 'sonner';
import { ThumbsUp, X, ListChecks, Pencil } from 'lucide-react';

interface Propuesta {
    id: number;
    titulo: string;
    descripcion: string;
    instructor_tentativo: string;
    votos: number;
    votos_negativos: number;
    estado: string;
    imagen_url?: string;
    fecha_creacion: string;
}

export default function ConvenioPropuestasPage() {
    const [propuestas, setPropuestas] = useState<Propuesta[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Edit modal
    const [editingPropuesta, setEditingPropuesta] = useState<Propuesta | null>(null);
    const [editForm, setEditForm] = useState({ titulo: '', descripcion: '', instructor_tentativo: '' });
    const [editImagen, setEditImagen] = useState<File | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const load = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await api.convenioMisPropuestas();
            setPropuestas(data);
        } catch {
            toast.error('Error cargando propuestas');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const openEdit = (p: Propuesta) => {
        setEditingPropuesta(p);
        setEditForm({ titulo: p.titulo, descripcion: p.descripcion || '', instructor_tentativo: p.instructor_tentativo || '' });
        setEditImagen(null);
    };

    const handleSaveEdit = async () => {
        if (!editingPropuesta) return;
        if (!editForm.titulo.trim()) { toast.error('El título es obligatorio'); return; }
        setIsSaving(true);
        try {
            const formData = new FormData();
            formData.append('titulo', editForm.titulo);
            if (editForm.descripcion) formData.append('descripcion', editForm.descripcion);
            if (editForm.instructor_tentativo) formData.append('instructor_tentativo', editForm.instructor_tentativo);
            if (editImagen) formData.append('imagen', editImagen);

            await api.convenioEditarPropuesta(editingPropuesta.id, formData);
            toast.success('Propuesta actualizada correctamente ✅');
            setEditingPropuesta(null);
            load();
        } catch (err: any) {
            toast.error(err.message || 'Error al actualizar');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Edit Modal */}
            {editingPropuesta && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-5">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <Pencil size={18} className="text-emerald-600" /> Editar Propuesta
                            </h2>
                            <button onClick={() => setEditingPropuesta(null)} className="text-gray-400 hover:text-gray-700">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-700">Título *</label>
                                <input
                                    value={editForm.titulo}
                                    onChange={e => setEditForm(f => ({ ...f, titulo: e.target.value }))}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                                    maxLength={150}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-700">Descripción</label>
                                <textarea
                                    value={editForm.descripcion}
                                    onChange={e => setEditForm(f => ({ ...f, descripcion: e.target.value }))}
                                    rows={4}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 resize-none"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-700">Instructor Tentativo</label>
                                <input
                                    value={editForm.instructor_tentativo}
                                    onChange={e => setEditForm(f => ({ ...f, instructor_tentativo: e.target.value }))}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                                    placeholder="Nombre del instructor"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-700">Nueva Imagen (Opcional)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={e => setEditImagen(e.target.files?.[0] || null)}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => setEditingPropuesta(null)}
                                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSaveEdit}
                                disabled={isSaving}
                                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition-colors disabled:opacity-50"
                            >
                                {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <ListChecks className="text-emerald-600" size={20} />
                </div>
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900">Mis Propuestas</h1>
                    <p className="text-gray-500 text-sm">Sigue en tiempo real el interés de los estudiantes</p>
                </div>
            </div>

            {isLoading ? (
                <div className="space-y-4">
                    {[1,2,3].map(i => <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />)}
                </div>
            ) : propuestas.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-2xl">
                    <ListChecks className="mx-auto text-gray-300 mb-3" size={40} />
                    <p className="text-gray-500 font-medium">Aún no has enviado propuestas</p>
                    <p className="text-gray-400 text-sm mt-1">Ve a "Nueva Propuesta" para empezar</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {propuestas.map(p => {
                        const isAprobado = p.estado === 'aceptado';
                        return (
                            <div
                                key={p.id}
                                className={`bg-white rounded-2xl border-2 p-5 shadow-sm transition-all ${
                                    isAprobado ? 'border-green-200' : 'border-gray-100'
                                }`}
                            >
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        {p.imagen_url && (
                                            <div className="mb-4">
                                                <img 
                                                    src={`${MEDIA_URL}/uploads/${p.imagen_url}`} 
                                                    alt={p.titulo} 
                                                    className="w-full max-h-48 object-cover rounded-xl shadow-sm"
                                                />
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                            <h2 className="font-bold text-gray-900 text-base">{p.titulo}</h2>
                                            <span className={`shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full ${
                                                isAprobado
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                                {isAprobado ? '✓ Aprobado' : '⏳ En votación'}
                                            </span>
                                            {/* Edit button — only for pending */}
                                            {!isAprobado && (
                                                <button
                                                    onClick={() => openEdit(p)}
                                                    title="Editar propuesta"
                                                    className="ml-auto p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                >
                                                    <Pencil size={14} />
                                                </button>
                                            )}
                                        </div>

                                        {p.descripcion && (
                                            <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-2">
                                                {p.descripcion}
                                            </p>
                                        )}

                                        {p.instructor_tentativo && (
                                            <p className="text-xs text-gray-400">
                                                Instructor tentativo: <strong className="text-gray-600">{p.instructor_tentativo}</strong>
                                            </p>
                                        )}

                                        <p className="text-xs text-gray-300 mt-2">
                                            Creada: {new Date(p.fecha_creacion).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </p>
                                    </div>

                                    {/* Stats Badges */}
                                    <div className="flex gap-2">
                                        <div className={`flex flex-col items-center justify-center w-16 h-16 rounded-2xl shrink-0 ${
                                            p.votos > 0 ? 'bg-emerald-50 border-2 border-emerald-200' : 'bg-gray-50 border-2 border-gray-100'
                                        }`}>
                                            <ThumbsUp
                                                size={16}
                                                className={p.votos > 0 ? 'text-emerald-600 mb-1' : 'text-gray-300 mb-1'}
                                            />
                                            <span className={`text-xl font-extrabold ${p.votos > 0 ? 'text-emerald-700' : 'text-gray-400'}`}>
                                                {p.votos}
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-center justify-center w-16 h-16 rounded-2xl shrink-0 bg-red-50/50 border-2 border-red-100">
                                            <X size={16} className="text-red-500 mb-1" />
                                            <span className="text-xl font-extrabold text-red-700">{p.votos_negativos}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
