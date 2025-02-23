import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Componente Card para mostrar contenido en un contenedor con estilo
 * @module Card
 * @example
 * ```tsx
 * <Card>
 *   <CardHeader>
 *     <h2>Título del Card</h2>
 *   </CardHeader>
 *   <CardContent>
 *     Contenido del card...
 *   </CardContent>
 * </Card>
 * ```
 */

/**
 * Props para el componente Card
 * @extends React.HTMLAttributes<HTMLDivElement>
 */
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Título opcional del card */
  title?: string;
}

/**
 * Props para los subcomponentes del Card
 * @extends React.HTMLAttributes<HTMLDivElement>
 */
interface CardSubComponentProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Card component for displaying content in a contained box
 * @param props - Component props
 * @param props.className - Additional CSS classes
 * @param props.title - Card title
 * @param props.children - Card content
 * @returns React component
 */
const Card = React.forwardRef<HTMLDivElement, CardProps>((props, ref) => {
  const { className, ...rest } = props;
  return (
    <div
      ref={ref}
      className={cn(
        'rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow',
        className
      )}
      {...rest}
    />
  );
});
Card.displayName = 'Card';

/**
 * Header section of the Card component
 */
const CardHeader = React.forwardRef<HTMLDivElement, CardSubComponentProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
  )
);
CardHeader.displayName = 'CardHeader';

/**
 * Content section of the Card component
 */
const CardContent = React.forwardRef<HTMLDivElement, CardSubComponentProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

export { Card, CardHeader, CardContent };

// Asegurarnos de que también se exporte como default
export default Card;
