import { useState } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import AuthLayout from '@/components/layouts/AuthLayout';
import Toast from '@/components/ui/Toast';
import Loading from '@/components/ui/Loading';
import { loginSchema, type LoginInput } from '@/lib/validations/auth';
import { useZodForm } from '@/hooks/useZodForm';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { signIn } = useAuthContext();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useZodForm(loginSchema);

  const onSubmit = async (data: LoginInput) => {
    setLoading(true);
    setError('');

    try {
      const { error } = await signIn(data);
      if (error) throw error;
      setSuccess('¡Inicio de sesión exitoso!');
      router.push('/dashboard');
    } catch (error) {
      setError('Error al iniciar sesión. Por favor, verifica tus credenciales.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h1 className="mb-8 text-center font-montserrat text-3xl font-bold uppercase text-primary">
        Iniciar Sesión
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          type="email"
          placeholder="Email"
          icon={<Mail size={20} />}
          disabled={loading}
          error={errors.email?.message}
          {...register('email')}
        />
        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            icon={<Lock size={20} />}
            disabled={loading}
            error={errors.password?.message}
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <Loading /> : 'Ingresar'}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-400">
        ¿No tienes una cuenta?{' '}
        <Link href="/auth/register" className="text-primary hover:underline">
          Regístrate
        </Link>
      </p>
      <Toast message={error} type="error" isVisible={!!error} onClose={() => setError('')} />
      <Toast
        message={success}
        type="success"
        isVisible={!!success}
        onClose={() => setSuccess('')}
      />
    </AuthLayout>
  );
}
