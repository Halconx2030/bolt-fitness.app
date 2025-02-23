# Servicios

## API Services

### AuthService

```typescript
import { AuthService } from '@/services/auth';

// Métodos disponibles
await AuthService.login(email, password);
await AuthService.register(userData);
await AuthService.resetPassword(email);
```

### WorkoutService

```typescript
import { WorkoutService } from '@/services/workout';

// Métodos disponibles
await WorkoutService.create(workoutData);
await WorkoutService.update(id, updateData);
await WorkoutService.delete(id);
```

## External Services

### Supabase

```typescript
import { supabase } from '@/lib/supabase';

// Ejemplos de uso
const { data, error } = await supabase.from('exercises').select('*').eq('muscle_group', 'chest');
```

### Analytics

```typescript
import { Analytics } from '@/services/analytics';

// Tracking de eventos
Analytics.trackEvent('workout_completed', {
  userId: 'user_id',
  workoutId: 'workout_id',
  duration: 3600,
});
```
