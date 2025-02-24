import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/exercises', () => {
    return HttpResponse.json([
      {
        id: 1,
        nombre: 'Sentadillas',
        descripcion: 'Ejercicio básico para piernas',
        nivel_requerido: 'PRINCIPIANTE',
        puntos: 100,
        tiempo_estimado: 15,
        categoria: 'piernas',
      },
      {
        id: 2,
        nombre: 'Flexiones',
        descripcion: 'Ejercicio para pecho y brazos',
        nivel_requerido: 'PRINCIPIANTE',
        puntos: 80,
        tiempo_estimado: 10,
        categoria: 'pecho',
      },
    ]);
  }),

  http.get('/api/users/profile', () => {
    return HttpResponse.json({
      id: 1,
      nombre: 'Usuario Test',
      email: 'test@example.com',
      nivel: 'PRINCIPIANTE',
      puntos_totales: 500,
    });
  }),

  http.post('/api/auth/login', () => {
    return HttpResponse.json({
      token: 'mock-jwt-token',
      user: {
        id: 1,
        email: 'test@example.com',
        nombre: 'Usuario Test',
      },
    });
  }),
];
