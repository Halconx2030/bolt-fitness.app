# Custom Hooks

## Descripción General

Esta sección contiene los hooks personalizados de la aplicación que encapsulan lógica reutilizable.

## Hooks Principales

### useAuth

```typescript
import { useAuth } from '@/hooks/useAuth';

// Uso
const { user, login, logout, isLoading } = useAuth();
```

### useWorkout

```typescript
import { useWorkout } from '@/hooks/useWorkout';

// Uso
const { workout, exercises, updateProgress, isLoading } = useWorkout(workoutId);
```

### useProgress

```typescript
import { useProgress } from '@/hooks/useProgress';

// Uso
const { progress, updateMetrics, getHistoricalData } = useProgress(userId);
```
