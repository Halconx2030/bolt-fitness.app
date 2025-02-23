# Contextos

## AuthContext

```typescript
import { useAuth } from '@/contexts/auth';

// Uso en componentes
function MyComponent() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginRedirect />;
  }

  return <div>Bienvenido, {user.name}</div>;
}
```

## WorkoutContext

```typescript
import { useWorkout } from '@/contexts/workout';

// Uso en componentes
function WorkoutComponent() {
  const {
    currentWorkout,
    setCurrentWorkout,
    updateExercise
  } = useWorkout();

  return (
    // Implementación
  );
}
```

## ThemeContext

```typescript
import { useTheme } from '@/contexts/theme';

// Uso en componentes
function ThemeAwareComponent() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={theme === 'dark' ? 'bg-dark' : 'bg-light'}>
      {/* Contenido */}
    </div>
  );
}
```
