import Link from 'next/link';
import { notFound } from 'next/navigation';

export default function NotFoundCatchAll() {
  notFound();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <h2 className="text-2xl font-semibold mt-4">Página no encontrada</h2>
      <p className="text-muted-foreground mt-2">Lo sentimos, la página que buscas no existe.</p>
      <Link
        href="/"
        className="mt-8 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
