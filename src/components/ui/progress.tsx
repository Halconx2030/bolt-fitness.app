import { ReactNode } from 'react';

interface ProgressProps {
  value?: number;
  max?: number;
  className?: string;
  children?: ReactNode;
}

export const Progress = ({ value = 0, max = 100, className = '' }: ProgressProps) => {
  return (
    <div className="relative">
      <div
        data-testid="progress-indicator"
        className="absolute top-0 left-0 h-full bg-primary"
        style={{
          width: `${(value / max) * 100}%`,
          transform: `translateX(-${100 - (value / max) * 100}%)`,
        }}
      />
      <div className={`h-2 bg-gray-200 rounded ${className}`} />
    </div>
  );
};

export default Progress;
