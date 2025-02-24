# API y Servicios

## Visión General

BoltFitness.app utiliza una arquitectura basada en servicios que se comunican con Supabase como backend principal. La API está organizada en servicios modulares que manejan diferentes aspectos de la aplicación.

## Estructura de la API

```bash
src/
├── services/
│   ├── api/
│   │   ├── auth.ts
│   │   ├── exercises.ts
│   │   ├── workouts.ts
│   │   └── users.ts
│   ├── database/
│   │   └── supabase.ts
│   └── external/
│       └── analytics.ts
```

## Servicios Principales

### AuthService

Gestiona la autenticación y autorización.

```typescript
interface AuthService {
  login(email: string, password: string): Promise<User>;
  register(email: string, password: string): Promise<User>;
  logout(): Promise<void>;
  resetPassword(email: string): Promise<void>;
  updatePassword(newPassword: string): Promise<void>;
  setupTwoFactor(): Promise<TwoFactorSecret>;
  verifyTwoFactor(code: string): Promise<boolean>;
}
```

**Endpoints:**

- `POST /auth/login`
- `POST /auth/register`
- `POST /auth/logout`
- `POST /auth/reset-password`
- `POST /auth/two-factor/setup`
- `POST /auth/two-factor/verify`

### ExerciseService

Gestiona los ejercicios y sus metadatos.

```typescript
interface ExerciseService {
  getExercises(filters?: ExerciseFilters): Promise<Exercise[]>;
  getExerciseById(id: string): Promise<Exercise>;
  createExercise(data: CreateExerciseDTO): Promise<Exercise>;
  updateExercise(id: string, data: UpdateExerciseDTO): Promise<Exercise>;
  deleteExercise(id: string): Promise<void>;
  getExerciseProgress(id: string): Promise<ExerciseProgress[]>;
}
```

**Endpoints:**

- `GET /exercises`
- `GET /exercises/:id`
- `POST /exercises`
- `PUT /exercises/:id`
- `DELETE /exercises/:id`
- `GET /exercises/:id/progress`

### WorkoutService

Gestiona las rutinas de entrenamiento.

```typescript
interface WorkoutService {
  getWorkouts(): Promise<Workout[]>;
  getWorkoutById(id: string): Promise<Workout>;
  createWorkout(data: CreateWorkoutDTO): Promise<Workout>;
  updateWorkout(id: string, data: UpdateWorkoutDTO): Promise<Workout>;
  deleteWorkout(id: string): Promise<void>;
  addExerciseToWorkout(workoutId: string, exerciseId: string): Promise<void>;
  removeExerciseFromWorkout(workoutId: string, exerciseId: string): Promise<void>;
}
```

**Endpoints:**

- `GET /workouts`
- `GET /workouts/:id`
- `POST /workouts`
- `PUT /workouts/:id`
- `DELETE /workouts/:id`
- `POST /workouts/:id/exercises`
- `DELETE /workouts/:id/exercises/:exerciseId`

### UserService

Gestiona los perfiles y preferencias de usuarios.

```typescript
interface UserService {
  getProfile(): Promise<UserProfile>;
  updateProfile(data: UpdateProfileDTO): Promise<UserProfile>;
  getPreferences(): Promise<UserPreferences>;
  updatePreferences(data: UpdatePreferencesDTO): Promise<UserPreferences>;
  uploadAvatar(file: File): Promise<string>;
  getStats(): Promise<UserStats>;
}
```

**Endpoints:**

- `GET /users/profile`
- `PUT /users/profile`
- `GET /users/preferences`
- `PUT /users/preferences`
- `POST /users/avatar`
- `GET /users/stats`

## Integración con Supabase

### Configuración

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

### Ejemplos de Uso

#### Consultas Básicas

```typescript
// Obtener ejercicios
const { data: exercises, error } = await supabase
  .from('exercises')
  .select('*')
  .eq('muscle_group', 'Pecho')
  .order('created_at', { ascending: false });

// Insertar ejercicio
const { data, error } = await supabase.from('exercises').insert([
  {
    name: 'Press de Banca',
    muscle_group: 'Pecho',
    difficulty: 'Intermedio',
  },
]);
```

#### Relaciones

```typescript
// Obtener rutina con ejercicios
const { data: workout, error } = await supabase
  .from('workouts')
  .select(
    `
    *,
    exercises:workout_exercises(
      exercise_id,
      sets,
      reps,
      weight
    )
  `
  )
  .eq('id', workoutId)
  .single();
```

#### Tiempo Real

```typescript
// Suscribirse a actualizaciones de progreso
const subscription = supabase
  .from('exercise_progress')
  .on('INSERT', payload => {
    console.log('Nuevo progreso:', payload.new);
  })
  .subscribe();
```

## Manejo de Errores

### Tipos de Error

```typescript
interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

class DatabaseError extends Error {
  constructor(
    message: string,
    public code: string
  ) {
    super(message);
  }
}
```

### Middleware de Error

```typescript
async function errorHandler(error: any) {
  if (error instanceof DatabaseError) {
    return {
      status: 400,
      body: {
        error: error.message,
        code: error.code,
      },
    };
  }

  return {
    status: 500,
    body: {
      error: 'Error interno del servidor',
    },
  };
}
```

## Rate Limiting

```typescript
const rateLimit = {
  window: '15m',
  max: 100,
};

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
    rateLimit,
  },
};
```

## Seguridad

### Headers

```typescript
export const securityHeaders = {
  'Content-Security-Policy': "default-src 'self'",
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};
```

### Validación

```typescript
import { z } from 'zod';

const exerciseSchema = z.object({
  name: z.string().min(3).max(100),
  muscleGroup: z.enum(['Pecho', 'Espalda', 'Piernas']),
  difficulty: z.enum(['Principiante', 'Intermedio', 'Avanzado']),
  description: z.string().optional(),
});
```

## Monitoreo

### Logging

```typescript
import { logger } from '@/lib/logger';

logger.info('Ejercicio creado', { exerciseId, userId });
logger.error('Error al actualizar rutina', { workoutId, error });
```

### Métricas

```typescript
import { metrics } from '@/lib/metrics';

metrics.increment('api.exercises.created');
metrics.timing('api.workouts.duration', endTime - startTime);
```

## Testing

### Mocks

```typescript
import { mockSupabase } from '@/tests/mocks/supabase';

jest.mock('@supabase/supabase-js', () => ({
  createClient: () => mockSupabase,
}));
```

### Pruebas de Integración

```typescript
describe('ExerciseService', () => {
  it('creates exercise successfully', async () => {
    const service = new ExerciseService();
    const exercise = await service.createExercise({
      name: 'Press de Banca',
      muscleGroup: 'Pecho',
      difficulty: 'Intermedio',
    });

    expect(exercise).toHaveProperty('id');
  });
});
```

## Recursos

- [Documentación de Supabase](https://supabase.io/docs)
- [API Reference](https://supabase.io/docs/reference)
- [Guía de Seguridad](https://supabase.io/docs/guides/auth)
