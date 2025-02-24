import { cn } from '@/lib/utils';

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingSpinner({ className, size = 'sm', ...props }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-16 w-16 border-4',
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-t-primary border-r-transparent border-b-primary border-l-transparent',
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
}
