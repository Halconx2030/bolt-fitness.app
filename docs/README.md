# BoltFitness.app - Documentación Técnica

## Estructura del Proyecto

### Directorios Principales

```bash
src/
├── app/          # Componentes y lógica de la aplicación Next.js 13+
├── components/   # Componentes reutilizables
├── config/       # Configuraciones globales
├── contexts/     # Contextos de React
├── database/     # Configuración y modelos de base de datos
├── hooks/        # Custom hooks
├── lib/          # Utilidades y funciones compartidas
├── pages/        # Rutas y páginas (Next.js)
├── services/     # Servicios y APIs
├── styles/       # Estilos globales y temas
├── types/        # Definiciones de TypeScript
└── utils/        # Funciones utilitarias
```

## Tecnologías Principales

- **Frontend:**

  - Next.js 13+
  - TypeScript
  - Tailwind CSS
  - Shadcn/ui

- **Backend:**

  - Supabase
  - PostgreSQL
  - Prisma ORM

- **Testing:**

  - Jest
  - React Testing Library
  - Vitest

- **CI/CD:**
  - GitHub Actions
  - Vercel

## Guías de Desarrollo

### Configuración del Entorno

1. **Variables de Entorno:**

   ```bash
   # Copia el archivo de ejemplo
   cp .env.example .env

   # Configura las variables necesarias:
   NEXT_PUBLIC_SUPABASE_URL=tu_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key
   ```

2. **Instalación de Dependencias:**

   ```bash
   npm install
   ```

3. **Desarrollo Local:**
   ```bash
   npm run dev
   ```

### Pruebas

```bash
# Ejecutar todas las pruebas
npm run test

# Ejecutar pruebas en modo watch
npm run test:watch

# Verificar cobertura
npm run test:coverage
```

### Convenciones de Código

1. **Nombrado de Componentes:**

   ```typescript
   // Componentes en PascalCase
   export function WorkoutCard() { ... }

   // Hooks en camelCase con prefijo 'use'
   export function useWorkoutProgress() { ... }
   ```

2. **Estructura de Componentes:**

   ```typescript
   // src/components/WorkoutCard/index.tsx
   import { type WorkoutCardProps } from './types';
   import styles from './styles.module.css';

   export function WorkoutCard({ title, exercises }: WorkoutCardProps) {
     return (...)
   }
   ```

### Flujo de Trabajo Git

1. **Ramas:**

   - `main`: Producción
   - `develop`: Desarrollo
   - `feature/*`: Nuevas características
   - `fix/*`: Correcciones
   - `release/*`: Preparación para release

2. **Commits:**

   ```bash
   # Formato
   type(scope): description

   # Ejemplos
   feat(auth): add two-factor authentication
   fix(workouts): resolve progress calculation bug
   ```

## API y Endpoints

### Autenticación

```typescript
// Ejemplo de uso del cliente de Supabase
import { supabase } from '@/lib/supabase';

// Login
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'usuario@ejemplo.com',
  password: 'contraseña',
});
```

### Ejercicios

```typescript
// Obtener ejercicios
const { data: exercises } = await supabase
  .from('exercises')
  .select('*')
  .order('created_at', { ascending: false });
```

## Despliegue

### Vercel

1. **Preparación:**

   ```bash
   npm run build
   ```

2. **Despliegue:**
   ```bash
   npm run deploy
   ```

### Docker

```bash
# Construir imagen
docker build -t boltfitness .

# Ejecutar contenedor
docker run -p 3000:3000 boltfitness
```

## Monitoreo y Análisis

- **Logs:** Vercel Dashboard
- **Métricas:** Next.js Analytics
- **Errores:** Sentry

## Recursos Adicionales

- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Supabase](https://supabase.io/docs)
- [Guía de Tailwind CSS](https://tailwindcss.com/docs)
