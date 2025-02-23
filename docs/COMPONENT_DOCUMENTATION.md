# Guía de Documentación de Componentes

## Estructura Básica

Cada componente debe incluir:

1. **JSDoc Header**

   ````typescript
   /**
    * @component
    * @description Breve descripción del propósito del componente
    * @example
    * ```tsx
    * <ComponentName prop1="value" prop2={value} />
    * ```
    */
   ````

2. **Interface/Types**

   ```typescript
   interface ComponentProps {
     /** Descripción de la prop */
     propName: PropType;
   }
   ```

3. **Storybook Stories**
   - Historia básica
   - Variantes principales
   - Estados de error/carga
   - Casos de uso interactivos

## Mejores Prácticas

1. **Accesibilidad**

   - Documentar roles ARIA
   - Explicar manejo de teclado
   - Mencionar consideraciones de contraste

2. **Props**

   - Documentar valores por defecto
   - Explicar validaciones
   - Proporcionar ejemplos de uso

3. **Estados**

   - Documentar estados posibles
   - Explicar transiciones
   - Mencionar efectos secundarios

4. **Rendimiento**
   - Documentar optimizaciones
   - Mencionar casos de re-renderizado
   - Explicar uso de memorización

## Ejemplo Completo

````typescript
/**
 * @component ExerciseCard
 * @description Tarjeta que muestra información detallada de un ejercicio
 *
 * @example
 * ```tsx
 * <ExerciseCard
 *   exercise={{
 *     id: '1',
 *     name: 'Press de Banca',
 *     difficulty: 'Intermediate',
 *     muscleGroup: 'Pecho'
 *   }}
 *   onSelect={(id) => console.log('Ejercicio seleccionado:', id)}
 * />
 * ```
 */

interface ExerciseCardProps {
  /** Datos del ejercicio a mostrar */
  exercise: Exercise;
  /** Callback llamado cuando se selecciona el ejercicio */
  onSelect?: (id: string) => void;
  /** Indica si la tarjeta está en estado de carga */
  isLoading?: boolean;
}
````

## Checklist de Documentación

- [ ] JSDoc completo con descripción y ejemplo
- [ ] Props documentadas con tipos y descripciones
- [ ] Historias de Storybook creadas
- [ ] Consideraciones de accesibilidad documentadas
- [ ] Tests unitarios referenciados
- [ ] Ejemplos de uso común incluidos
