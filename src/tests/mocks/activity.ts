export const mockActivity = (type: 'workout' | 'achievement' | 'default' = 'workout') => {
  const baseActivity = {
    id: '1',
    date: new Date('2024-01-20T12:00:00Z').toISOString(),
    user: {
      id: '1',
      name: 'Juan Pérez',
      avatar: '/images/avatar.jpg',
    },
  };

  switch (type) {
    case 'workout':
      return {
        ...baseActivity,
        type: 'workout',
        title: 'Completó una rutina',
        description: 'Rutina de pecho y hombros',
      };
    case 'achievement':
      return {
        ...baseActivity,
        type: 'achievement',
        title: 'Obtuvo un logro',
        description: 'Completó 10 entrenamientos',
      };
    case 'default':
      return {
        ...baseActivity,
        type: 'other',
        title: 'Otra actividad',
        description: 'Descripción de otra actividad',
      };
  }
};

export const mockActivities = [
  mockActivity('workout'),
  mockActivity('achievement'),
  mockActivity('default'),
];
