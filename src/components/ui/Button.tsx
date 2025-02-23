import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'rounded-xl font-montserrat font-bold transition-all duration-300',
          {
            'bg-[#FFD700] text-[#1E1E1E] hover:brightness-110': variant === 'primary',
            'bg-[#2C2C2C] text-white hover:bg-[#3C3C3C]': variant === 'secondary',
            'border-2 border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-[#1E1E1E]':
              variant === 'outline',
          },
          {
            'px-4 py-2 text-sm': size === 'sm',
            'px-6 py-3 text-base': size === 'md',
            'px-8 py-4 text-lg': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
