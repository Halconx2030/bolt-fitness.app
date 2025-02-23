# Testing

## Configuración

### Jest

```typescript
// jest.config.js
module.exports = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
```

## Ejemplos de Tests

### Componentes

```typescript
import { render, screen } from '@testing-library/react';
import { WorkoutCard } from '@/components/WorkoutCard';

describe('WorkoutCard', () => {
  it('renders workout details correctly', () => {
    render(<WorkoutCard title="Mi Rutina" />);
    expect(screen.getByText('Mi Rutina')).toBeInTheDocument();
  });
});
```

### Hooks

```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useWorkout } from '@/hooks/useWorkout';

describe('useWorkout', () => {
  it('updates workout state correctly', () => {
    const { result } = renderHook(() => useWorkout());

    act(() => {
      result.current.updateWorkout({ name: 'Nueva Rutina' });
    });

    expect(result.current.workout.name).toBe('Nueva Rutina');
  });
});
```

## Mocks

```typescript
// __mocks__/supabase.ts
export const supabase = {
  auth: {
    signIn: jest.fn(),
    signOut: jest.fn(),
  },
  from: jest.fn(),
};
```
