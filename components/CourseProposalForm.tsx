'use client';

import React from "react"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { api } from '@/lib/api';

interface CourseProposalFormProps {
  onSuccess?: () => void;
}

export function CourseProposalForm({ onSuccess }: CourseProposalFormProps) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [duracion, setDuracion] = useState('');
  const [requisitos, setRequisitos] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.proponerCurso({
        nombre,
        descripcion,
        duracion,
        requisitos,
      });
      toast.success('Curso propuesto exitosamente');
      setNombre('');
      setDescripcion('');
      setDuracion('');
      setRequisitos('');
      onSuccess?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al proponer curso');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Proponer Nuevo Curso</CardTitle>
        <CardDescription>Completa el formulario para proponer un nuevo curso</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre */}
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre del Curso *</Label>
            <Input
              id="nombre"
              type="text"
              placeholder="ej: Panadería Artesanal"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción *</Label>
            <Textarea
              id="descripcion"
              placeholder="Describe los contenidos y objetivos del curso"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="min-h-24"
              required
            />
          </div>

          {/* Duración */}
          <div className="space-y-2">
            <Label htmlFor="duracion">Duración *</Label>
            <Input
              id="duracion"
              type="text"
              placeholder="ej: 8 semanas, 40 horas"
              value={duracion}
              onChange={(e) => setDuracion(e.target.value)}
              required
            />
          </div>

          {/* Requisitos */}
          <div className="space-y-2">
            <Label htmlFor="requisitos">Requisitos Previos *</Label>
            <Textarea
              id="requisitos"
              placeholder="ej: Conocimientos básicos de cocina"
              value={requisitos}
              onChange={(e) => setRequisitos(e.target.value)}
              className="min-h-20"
              required
            />
          </div>

          {/* Botón Enviar */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-orange-600 hover:bg-orange-700"
          >
            {isLoading ? 'Proponiendo...' : 'Proponer Curso'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
