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
import { registerSchema, type RegisterInput } from '@/lib/validations/auth';
import { useZodForm } from '@/hooks/useZodForm';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { signUp } = useAuthContext();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useZodForm(registerSchema);

  const onSubmit = async (data: RegisterInput) => {
    setLoading(true);
    setError('');

    try {
      const { error } = await signUp({
        email: data.email,
        password: data.password,
      });
      if (error) throw error;
      setSuccess('¡Registro exitoso! Redirigiendo al login...');
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } catch (error) {
      setError('Error al registrarse. Por favor, intenta con otro email.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h1 className="mb-8 text-center font-montserrat text-3xl font-bold uppercase text-primary">
        Registro
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
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        <Input
          type={showPassword ? 'text' : 'password'}
          placeholder="Confirmar Password"
          icon={<Lock size={20} />}
          disabled={loading}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <Loading /> : 'Registrarse'}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-400">
        ¿Ya tienes una cuenta?{' '}
        <Link href="/auth/login" className="text-primary hover:underline">
          Inicia sesión
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
