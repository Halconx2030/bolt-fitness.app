'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Implementar lógica de login real
      // Por ahora solo simulamos un login exitoso
      await new Promise(resolve => setTimeout(resolve, 1000));
      document.cookie = 'auth-token=demo-token; path=/';
      toast.success('Inicio de sesión exitoso');
      router.push('/dashboard');
    } catch (error) {
      toast.error('Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-secondary/30 p-4">
      <div className="w-full max-w-sm space-y-8 rounded-xl border border-border/10 bg-black/40 p-8 shadow-2xl backdrop-blur-sm">
        <div className="space-y-2 text-center">
          <div className="relative mx-auto mb-6 h-28 w-28">
            <Image
              src="/images/bolt-logo.png"
              alt="BoltFitness Logo"
              width={112}
              height={112}
              className="logo-glow rounded-2xl"
              priority
            />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            <span className="text-primary">BOLT</span>
            <span className="text-foreground">FITNESS</span>
          </h1>
          <p className="text-sm text-muted-foreground/80">
            Ingresa tus credenciales para continuar
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm text-foreground/90">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                required
                disabled={isLoading}
                className="bg-black/50 focus:bg-black/70"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm text-foreground/90">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                disabled={isLoading}
                className="bg-black/50 focus:bg-black/70"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]"
            disabled={isLoading}
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>
        </form>
      </div>
    </div>
  );
}
