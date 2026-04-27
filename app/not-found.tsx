import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
        <p className="text-2xl font-semibold text-gray-700 mb-2">
          Página no encontrada
        </p>
        <p className="text-gray-600 mb-8">
          Lo sentimos, la página que buscas no existe.
        </p>
        <Link href="/">
          <Button className="bg-blue-600 hover:bg-blue-700">
            Volver al inicio
          </Button>
        </Link>
      </div>
    </main>
  );
}
