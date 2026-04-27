'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import {
    BarChart3,
    FileText,
    BookOpen,
    UserPlus,
    User,
    TrendingUp,
    LogOut,
    Menu,
    X,
    FileBadge
} from 'lucide-react';
import Image from 'next/image';

const navItems = [
    { name: 'Estadísticas', href: '/admin', icon: BarChart3 },
    { name: 'Crear Curso', href: '/admin/courses', icon: BookOpen },
    { name: 'Votación de Cursos', href: '/admin/votaciones', icon: TrendingUp },
    { name: 'Crear Usuario', href: '/admin/users', icon: UserPlus },
    { name: 'Certificados', href: '/admin/certificados', icon: FileBadge },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const pathname = usePathname();
    const { logout, user } = useAuth();

    return (
        <ProtectedRoute requiredRole="admin">
            <div className="min-h-screen bg-[#F4F9FB] flex">

                {/* Mobile Sidebar Overlay */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <aside
                    className={`fixed inset-y-0 left-0 z-50 w-[260px] bg-white border-r border-gray-200 shadow-sm flex flex-col transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
                >
                    {/* Logo Handle */}
                    <div className="p-6 flex items-center justify-between border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <Image src="/logo-epe.png" alt="EPE Logo" width={40} height={40} className="w-10 h-10" />
                            <div>
                                <h2 className="text-xl font-bold text-[#1e3a8a] leading-tight">EPE<br /><span className="text-sm font-semibold text-red-600">Admin</span></h2>
                            </div>
                        </div>
                        <button className="lg:hidden text-gray-500 hover:text-[#1e3a8a]" onClick={() => setIsSidebarOpen(false)}>
                            <X size={24} />
                        </button>
                    </div>

                    {/* User Profile Summary in Sidebar */}
                    <div className="px-6 py-6 border-b border-gray-50 bg-gray-50/30">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white overflow-hidden border-2 border-white shadow-sm">
                                {user?.foto_perfil ? (
                                    <img src={`http://127.0.0.1:5000${user.foto_perfil}`} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={18} />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-gray-900 truncate">{user?.nombre}</p>
                                <p className="text-xs text-red-600 font-semibold truncate capitalize">Administrador</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${isActive
                                        ? 'bg-red-50 text-red-700 shadow-sm'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-red-700'
                                        }`}
                                >
                                    <Icon size={20} className={isActive ? 'text-red-700' : 'text-gray-500'} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Logout Button */}
                    <div className="p-4 border-t border-gray-100">
                        <button
                            onClick={() => {
                                logout();
                                window.location.href = '/login';
                            }}
                            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                        >
                            <LogOut size={20} />
                            Cerrar Sesión
                        </button>
                    </div>
                </aside>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-h-screen overflow-hidden text-black pt-4 md:pt-0">

                    {/* Mobile Topbar */}
                    <header className="lg:hidden bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 shadow-sm z-30 sticky top-0">
                        <div className="flex items-center gap-3">
                            <Image src="/logo-epe.png" alt="EPE Logo" width={32} height={32} className="w-8 h-8" />
                            <span className="font-bold text-[#1e3a8a]">Panel Admin</span>
                        </div>
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 -mr-2 text-gray-600 hover:text-[#1e3a8a] rounded-md hover:bg-gray-50 transition-colors"
                        >
                            <Menu size={24} />
                        </button>
                    </header>

                    {/* Render Page Content inside main bounding box */}
                    <div className="flex-1 overflow-y-auto p-4 md:p-8">
                        {children}
                    </div>
                </div>

            </div>
        </ProtectedRoute>
    );
}

