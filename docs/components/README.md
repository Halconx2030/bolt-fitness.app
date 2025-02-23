# Componentes

## Estructura de Componentes

Cada componente sigue una estructura consistente:

```typescript
src/components/
├── ui/                 # Componentes base (botones, inputs, etc.)
├── layout/            # Componentes de estructura (header, footer, etc.)
├── features/          # Componentes específicos de características
└── shared/            # Componentes compartidos
```

## Componentes UI

### Button

```typescript
import { Button } from '@/components/ui/button';

// Variantes
<Button variant="primary">Guardar</Button>
<Button variant="secondary">Cancelar</Button>
<Button variant="ghost">Más información</Button>
```

### Card

```typescript
import { Card } from '@/components/ui/card';

<Card>
  <Card.Header>
    <Card.Title>Rutina del Día</Card.Title>
  </Card.Header>
  <Card.Content>
    {/* Contenido */}
  </Card.Content>
</Card>
```

## Componentes de Características

### WorkoutPlan

```typescript
import { WorkoutPlan } from '@/components/features/workout-plan';

<WorkoutPlan
  userId="123"
  level="intermediate"
  goals={['strength', 'cardio']}
/>
```

### ProgressTracker

```typescript
import { ProgressTracker } from '@/components/features/progress-tracker';

<ProgressTracker
  exerciseId="456"
  metrics={['weight', 'reps']}
/>
```
