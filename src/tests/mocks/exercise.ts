export const mockExercise = {
  id: '1',
  name: 'Press de Banca',
  description: 'Ejercicio clásico para pecho',
  muscleGroup: 'Pecho',
  difficulty: 'Intermedio',
  equipment: 'Barra y Pesas',
  videoUrl: 'https://example.com/video.mp4',
  imageUrl: '/images/bench-press.jpg',
  instructions: [
    'Acuéstate en el banco',
    'Agarra la barra con las manos',
    'Baja la barra al pecho',
    'Empuja hacia arriba',
  ],
  tips: [
    'Mantén los codos cerca del cuerpo',
    'Respira de manera controlada',
    'Mantén los pies firmes en el suelo',
  ],
  sets: 3,
  reps: 12,
  restTime: 90,
};

export const mockExercises = [
  mockExercise,
  {
    ...mockExercise,
    id: '2',
    name: 'Sentadillas',
    description: 'Ejercicio fundamental para piernas',
    muscleGroup: 'Piernas',
    difficulty: 'Avanzado',
    imageUrl: '/images/squats.jpg',
  },
];
