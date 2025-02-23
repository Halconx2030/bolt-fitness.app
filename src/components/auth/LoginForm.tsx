import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { validateEmail, validatePassword } from '@/utils/validation';

interface LoginFormProps {
  onSuccess?: () => void;
}

const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('Email inválido');
      return;
    }

    if (!validatePassword(password)) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      const result = await login(email, password);
      if (!result?.ok) {
        setError(result?.error || 'Credenciales inválidas');
      } else if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      setError('Error al iniciar sesión');
      console.error('Login error:', error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Formulario de inicio de sesión"
      noValidate
      className="space-y-4"
    >
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium">
          Correo electrónico
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="tu@email.com"
          required
          aria-required="true"
          aria-invalid={!!error && !validateEmail(email)}
          aria-describedby={error ? 'email-error' : undefined}
          className="w-full px-3 py-2 border rounded-md"
          data-testid="email-input"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          aria-required="true"
          aria-invalid={!!error && !validatePassword(password)}
          aria-describedby={error ? 'password-error' : undefined}
          className="w-full px-3 py-2 border rounded-md"
          data-testid="password-input"
        />
      </div>

      {error && (
        <div
          role="alert"
          aria-live="polite"
          className="text-red-600 text-sm"
          data-testid="error-message"
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 text-white bg-primary rounded-md"
        aria-busy={loading}
      >
        {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
      </button>
    </form>
  );
};

export default LoginForm;
