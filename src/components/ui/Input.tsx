import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, type = 'text', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <label className="mb-2 block text-sm font-medium text-gray-900">{label}</label>}
        <input
          type={type}
          className={cn(
            'block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900',
            'focus:border-primary focus:ring-primary',
            error ? 'border-red-500' : '',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
