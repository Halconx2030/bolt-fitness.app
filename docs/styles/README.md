# Estilos y Sistema de Diseño

## Visión General

BoltFitness.app utiliza un sistema de diseño moderno y consistente basado en Tailwind CSS y Shadcn/ui, con un enfoque en la accesibilidad y la experiencia de usuario.

## Tecnologías

- Tailwind CSS
- Shadcn/ui
- CSS Modules (para estilos específicos)
- CSS Variables
- PostCSS

## Configuración

### Tailwind CSS

```javascript
// tailwind.config.js
const { fontFamily } = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
        },
        success: {
          50: '#f0fdf4',
          500: '#22c55e',
          700: '#15803d',
        },
        error: {
          50: '#fef2f2',
          500: '#ef4444',
          700: '#b91c1c',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', ...fontFamily.sans],
        display: ['var(--font-montserrat)', ...fontFamily.sans],
      },
      spacing: {
        4.5: '1.125rem',
        5.5: '1.375rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'inner-sm': 'inset 0 1px 2px 0 rgb(0 0 0 / 0.05)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};
```

### CSS Variables

```css
/* styles/variables.css */
:root {
  /* Colores */
  --color-primary: #0ea5e9;
  --color-secondary: #64748b;
  --color-success: #22c55e;
  --color-error: #ef4444;

  /* Espaciado */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  /* Tipografía */
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;

  /* Bordes */
  --border-radius-sm: 0.25rem;
  --border-radius-md: 0.375rem;
  --border-radius-lg: 0.5rem;

  /* Transiciones */
  --transition-fast: 150ms;
  --transition-normal: 250ms;
  --transition-slow: 350ms;
}

/* Dark Mode */
.dark {
  --color-primary: #38bdf8;
  --color-secondary: #94a3b8;
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
}
```

## Componentes UI

### Botones

```typescript
// components/ui/Button.tsx
import { cva } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary-600 text-white hover:bg-primary-700',
        secondary: 'bg-secondary-100 text-secondary-900 hover:bg-secondary-200',
        outline: 'border border-input bg-background hover:bg-accent',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4',
        lg: 'h-12 px-6 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export function Button({ variant, size, className, ...props }) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
```

### Cards

```typescript
// components/ui/Card.tsx
export function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        'rounded-lg border bg-card text-card-foreground shadow-sm',
        className
      )}
      {...props}
    />
  );
}

Card.Header = function CardHeader({ className, ...props }) {
  return (
    <div
      className={cn('flex flex-col space-y-1.5 p-6', className)}
      {...props}
    />
  );
};

// ... más subcomponentes
```

## Layouts

### Grid System

```typescript
// components/layouts/Grid.tsx
export function Grid({ columns = 1, gap = 4, children }) {
  return (
    <div
      className={cn(
        'grid',
        `grid-cols-1 md:grid-cols-${columns}`,
        `gap-${gap}`
      )}
    >
      {children}
    </div>
  );
}
```

### Container

```typescript
// components/layouts/Container.tsx
export function Container({ className, ...props }) {
  return (
    <div
      className={cn(
        'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8',
        className
      )}
      {...props}
    />
  );
}
```

## Utilidades

### Mixins

```scss
// styles/mixins.scss
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

@mixin responsive-text($min, $max, $min-vw, $max-vw) {
  font-size: clamp(#{$min}rem, #{$min-vw}vw + #{$max-vw}rem, #{$max}rem);
}

@mixin truncate-text($lines: 1) {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: $lines;
  -webkit-box-orient: vertical;
}
```

### Helpers

```typescript
// utils/styles.ts
export function cn(...classes: string[]) {
  return twMerge(clsx(classes));
}

export function getResponsiveValue(value: any, breakpoint: string) {
  const breakpoints = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  };

  return `@media (min-width: ${breakpoints[breakpoint]}) { ${value} }`;
}
```

## Temas

### Configuración de Tema

```typescript
// styles/theme.ts
export const theme = {
  light: {
    background: {
      primary: '#ffffff',
      secondary: '#f8fafc',
      accent: '#f1f5f9',
    },
    text: {
      primary: '#0f172a',
      secondary: '#475569',
      muted: '#64748b',
    },
    // ... más tokens
  },
  dark: {
    background: {
      primary: '#0f172a',
      secondary: '#1e293b',
      accent: '#334155',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#e2e8f0',
      muted: '#94a3b8',
    },
    // ... más tokens
  },
};
```

### Uso del Tema

```typescript
// hooks/useTheme.ts
export function useTheme() {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
  };

  return { theme, toggleTheme };
}
```

## Animaciones

### Keyframes

```css
/* styles/animations.css */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

.animate-slide-in {
  animation: slideIn 0.4s ease-out;
}
```

### Transiciones

```typescript
// components/Transition.tsx
import { Transition } from '@headlessui/react';

export function FadeTransition({ show, children }) {
  return (
    <Transition
      show={show}
      enter="transition-opacity duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      {children}
    </Transition>
  );
}
```

## Responsive Design

### Breakpoints

```typescript
// constants/breakpoints.ts
export const breakpoints = {
  sm: '640px', // Móvil
  md: '768px', // Tablet
  lg: '1024px', // Desktop
  xl: '1280px', // Wide Desktop
  '2xl': '1536px', // Ultra Wide
};

// Uso con CSS-in-JS
const styles = {
  container: {
    width: '100%',
    [`@media (min-width: ${breakpoints.md})`]: {
      maxWidth: '768px',
    },
  },
};
```

### Media Queries

```scss
// styles/media.scss
@mixin mobile {
  @media (max-width: 639px) {
    @content;
  }
}

@mixin tablet {
  @media (min-width: 640px) and (max-width: 1023px) {
    @content;
  }
}

@mixin desktop {
  @media (min-width: 1024px) {
    @content;
  }
}
```

## Accesibilidad

### Utilidades de Accesibilidad

```typescript
// components/ui/VisuallyHidden.tsx
export function VisuallyHidden({ children }) {
  return (
    <span className="sr-only">
      {children}
    </span>
  );
}

// components/ui/FocusRing.tsx
export function FocusRing({ children }) {
  return (
    <div className="focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
      {children}
    </div>
  );
}
```

## Mejores Prácticas

1. **Organización de Estilos**

   ```bash
   styles/
   ├── base/          # Estilos base y reset
   ├── components/    # Estilos de componentes
   ├── layouts/       # Estilos de layouts
   ├── utils/         # Utilidades y mixins
   └── variables/     # Variables y tokens
   ```

2. **Nomenclatura BEM**

   ```css
   .card {
   }
   .card__header {
   }
   .card__content {
   }
   .card--featured {
   }
   ```

3. **Mobile First**
   ```css
   .component {
     /* Estilos base para móvil */
     @media (min-width: 768px) {
       /* Estilos para tablet y desktop */
     }
   }
   ```

## Recursos

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Shadcn/ui Components](https://ui.shadcn.com)
- [CSS Variables Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [CSS Modules](https://github.com/css-modules/css-modules)
