# Componentes de Ejercicios

## Visión General

Los componentes de ejercicios forman el núcleo de la funcionalidad de entrenamiento en BoltFitness.app. Estos componentes permiten a los usuarios ver, filtrar y gestionar ejercicios.

## Componentes Principales

### ExerciseCard

Tarjeta que muestra la información básica de un ejercicio.

```typescript
interface ExerciseCardProps {
  exercise: {
    id: string;
    name: string;
    muscleGroup: string;
    difficulty: string;
    image?: string;
  };
}
```

**Características:**

- Muestra nombre, grupo muscular y dificultad
- Imagen del ejercicio con fallback
- Diseño responsive
- Accesible mediante teclado

### ExerciseFilters

Panel de filtros para buscar y filtrar ejercicios.

```typescript
interface ExerciseFiltersProps {
  filters: {
    muscleGroup: string;
    difficulty: string;
    equipment: string;
    search: string;
  };
  options: {
    muscleGroups: string[];
    difficulties: string[];
    equipment: string[];
  };
  onFilterChange: (filters: Filters) => void;
}
```

**Características:**

- Búsqueda por texto
- Filtros por grupo muscular
- Filtros por dificultad
- Filtros por equipamiento
- Botón de reset
- Totalmente accesible

### ExerciseGrid

Cuadrícula responsiva para mostrar múltiples ejercicios.

```typescript
interface ExerciseGridProps {
  exercises: Exercise[];
  isLoading?: boolean;
  error?: Error;
}
```

**Características:**

- Layout responsivo con CSS Grid
- Estados de carga y error
- Animaciones suaves
- Lazy loading de imágenes

### ExerciseDetail

Vista detallada de un ejercicio específico.

```typescript
interface ExerciseDetailProps {
  exerciseId: string;
  onClose?: () => void;
}
```

**Características:**

- Información detallada del ejercicio
- Instrucciones paso a paso
- Videos demostrativos
- Historial de progreso
- Comentarios y valoraciones

## Estado de Pruebas

| Componente       | Cobertura | Última Actualización |
| ---------------- | --------- | -------------------- |
| ExerciseCard     | 100%      | 23/02/2024           |
| ExerciseFilters  | 100%      | 23/02/2024           |
| ExerciseGrid     | 100%      | 23/02/2024           |
| ExerciseDetail   | 100%      | 23/02/2024           |
| ExerciseProgress | 100%      | 23/02/2024           |
| ExerciseComments | 100%      | 23/02/2024           |

## Mejores Prácticas

### Accesibilidad

- Uso de roles ARIA apropiados
- Navegación completa por teclado
- Textos alternativos para imágenes
- Contraste de colores adecuado

### Rendimiento

- Lazy loading de imágenes
- Memoización de componentes pesados
- Optimización de re-renders
- Code splitting por rutas

### Mantenibilidad

- Componentes modulares
- Props tipadas con TypeScript
- Documentación inline
- Pruebas unitarias completas

## Ejemplos de Uso

### ExerciseCard

```tsx
import { ExerciseCard } from '@/components/exercises/ExerciseCard';

function ExerciseList() {
  return (
    <div>
      <ExerciseCard
        exercise={{
          id: '1',
          name: 'Press de Banca',
          muscleGroup: 'Pecho',
          difficulty: 'Intermedio',
          image: '/exercises/bench-press.jpg',
        }}
      />
    </div>
  );
}
```

### ExerciseFilters

```tsx
import { ExerciseFilters } from '@/components/exercises/ExerciseFilters';

function ExercisePage() {
  const [filters, setFilters] = useState({
    muscleGroup: '',
    difficulty: '',
    equipment: '',
    search: '',
  });

  return (
    <ExerciseFilters
      filters={filters}
      options={{
        muscleGroups: ['Pecho', 'Espalda', 'Piernas'],
        difficulties: ['Principiante', 'Intermedio', 'Avanzado'],
        equipment: ['Mancuernas', 'Barra', 'Máquina'],
      }}
      onFilterChange={setFilters}
    />
  );
}
```

## Roadmap

### Próximas Mejoras

1. Añadir soporte para ejercicios personalizados
2. Implementar sistema de favoritos
3. Mejorar las animaciones de transición
4. Añadir más opciones de filtrado
5. Integrar con API de vídeos de ejercicios

### Problemas Conocidos

- El rendimiento puede degradarse con más de 100 ejercicios
- Algunas imágenes pueden tardar en cargar en conexiones lentas
- Los filtros no persisten entre sesiones

## Contribución

Para contribuir a estos componentes:

1. Crear una rama desde `develop`
2. Implementar cambios siguiendo las guías de estilo
3. Asegurar cobertura de pruebas >80%
4. Crear PR con descripción detallada
5. Esperar revisión de código
