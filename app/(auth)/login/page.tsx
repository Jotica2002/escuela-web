'use client';

import React from "react"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { toast } from 'sonner';
import Link from 'next/link';
import { Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState<'student' | 'teacher' | 'admin'>('student');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { rol: serverRol } = await login(email, password);
      toast.success('Bienvenido a la Escuela de Emprendimiento');

      // Redirect based on the actual role returned by the server JWT payload
      if (serverRol === 'student') router.push('/student');
      else if (serverRol === 'teacher' || serverRol === 'profesor') router.push('/teacher');
      else if (serverRol === 'admin') router.push('/admin');
      else if (serverRol === 'convenio') router.push('/convenio');
      else router.push('/login');

    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error en login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F4F9FB] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg border-0 rounded-2xl overflow-hidden bg-white">
          <CardHeader className="text-center pb-2 pt-8">
            <div className="flex justify-center mb-6">
              <Image
                src="/logo-epe.png" // Ensure you have this logo, or replace with generic
                alt="EPE Logo"
                width={70}
                height={70}
                className="h-16 w-16"
              />
            </div>
            <h1 className="text-2xl font-bold text-[#1e3a8a] leading-tight mb-2">
              Escuela de<br />Emprendimiento
            </h1>
            <p className="text-sm text-gray-500 mt-2 mb-4">Accede a tu cuenta</p>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold text-[#1e3a8a]">Correo Electrónico</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#1e3a8a]">
                    <Mail size={18} />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="ejemplo@escuela.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 border-gray-200 focus:border-[#1e3a8a] focus:ring-[#1e3a8a] rounded-lg h-11"
                    required
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div className="space-y-1.5 border-b border-gray-100 pb-6">
                <Label htmlFor="password" className="text-xs font-semibold text-[#1e3a8a]">Contraseña</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#1e3a8a]">
                    <Lock size={18} />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 border-gray-200 focus:border-[#1e3a8a] focus:ring-[#1e3a8a] rounded-lg h-11"
                    required
                  />
                </div>
              </div>

              {/* Botón Login */}
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#203b82] hover:bg-[#1a2f6c] text-white rounded-lg h-11 text-base font-medium shadow-md transition-colors"
                >
                  {isLoading ? 'Ingresando...' : 'Ingresar'}
                </Button>
              </div>

              {/* Enlace a Signup */}
              <div className="text-center text-sm text-gray-500 mt-6 mt-4">
                ¿No tienes cuenta?{' '}
                <Link href="/signup" className="text-[#1e3a8a] hover:underline font-semibold">
                  Regístrate aquí
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
