import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { SonnerProvider } from '@/components/SonnerProvider'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'EPE - Escuela de Emprendimiento Antonio Patricio de Alcalá',
  description: 'Plataforma de gestión de cursos para la Escuela de Emprendimiento Antonio Patricio de Alcalá',
  generator: 'v0.app',
  icons: {
    icon: '/logo-epe.png',
    apple: '/logo-epe.png',
  },
  openGraph: {
    title: 'EPE - Escuela de Emprendimiento',
    description: 'Plataforma educativa de emprendimiento',
    images: [
      {
        url: '/logo-epe.png',
        width: 400,
        height: 400,
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`font-sans antialiased`}>
        <AuthProvider>
          {children}
          <SonnerProvider />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
