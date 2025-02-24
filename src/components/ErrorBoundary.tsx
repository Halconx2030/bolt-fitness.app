'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

export function ErrorBoundary({ children }: Props) {
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const errorHandler = (event: ErrorEvent) => {
      event.preventDefault();
      setError(event.error);

      // Log error en desarrollo
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error capturado por ErrorBoundary:', event.error);
      }
    };

    window.addEventListener('error', errorHandler);
    return () => window.removeEventListener('error', errorHandler);
  }, []);

  if (error) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center p-4">
        <Card className="max-w-lg w-full p-6 space-y-4">
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-6 w-6" />
            <h2 className="text-xl font-semibold">¡Ups! Algo salió mal</h2>
          </div>

          <p className="text-muted-foreground">
            Ha ocurrido un error inesperado. Hemos registrado el problema y lo resolveremos pronto.
          </p>

          {process.env.NODE_ENV !== 'production' && (
            <div className="mt-4 p-4 bg-muted rounded-lg overflow-auto">
              <p className="font-mono text-sm text-destructive">{error.toString()}</p>
            </div>
          )}

          <div className="flex gap-2 mt-4">
            <Button onClick={() => window.location.reload()} variant="default">
              Recargar página
            </Button>
            <Button onClick={() => window.history.back()} variant="outline">
              Volver atrás
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return children;
}
