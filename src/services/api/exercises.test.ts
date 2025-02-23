import { exerciseService } from './exercises';
import { supabase } from '@/lib/supabase';

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockReturnThis(),
    })),
  },
}));

describe('exerciseService', () => {
  const mockExercise = {
    id: '1',
    name: 'Press de Banca',
    description: 'Ejercicio clásico de pecho',
    muscleGroup: 'Pecho',
    difficulty: 'Intermedio',
    equipment: 'Barra',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getExercises', () => {
    it('obtiene la lista de ejercicios correctamente', async () => {
      const mockResponse = { data: [mockExercise], error: null };
      (supabase.from().select as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await exerciseService.getExercises();

      expect(result).toEqual([mockExercise]);
      expect(supabase.from).toHaveBeenCalledWith('exercises');
      expect(supabase.from().select).toHaveBeenCalled();
    });

    it('maneja errores al obtener ejercicios', async () => {
      const mockError = new Error('Error al obtener ejercicios');
      (supabase.from().select as jest.Mock).mockRejectedValueOnce(mockError);

      await expect(exerciseService.getExercises()).rejects.toThrow('Error al obtener ejercicios');
    });
  });

  describe('getExerciseById', () => {
    it('obtiene un ejercicio por ID correctamente', async () => {
      const mockResponse = { data: mockExercise, error: null };
      (supabase.from().select().single as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await exerciseService.getExerciseById('1');

      expect(result).toEqual(mockExercise);
      expect(supabase.from).toHaveBeenCalledWith('exercises');
      expect(supabase.from().select().eq).toHaveBeenCalledWith('id', '1');
    });

    it('maneja ejercicio no encontrado', async () => {
      const mockResponse = { data: null, error: null };
      (supabase.from().select().single as jest.Mock).mockResolvedValueOnce(mockResponse);

      await expect(exerciseService.getExerciseById('999')).rejects.toThrow(
        'Ejercicio no encontrado'
      );
    });
  });

  describe('createExercise', () => {
    it('crea un ejercicio correctamente', async () => {
      const mockResponse = { data: mockExercise, error: null };
      (supabase.from().insert as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await exerciseService.createExercise(mockExercise);

      expect(result).toEqual(mockExercise);
      expect(supabase.from).toHaveBeenCalledWith('exercises');
      expect(supabase.from().insert).toHaveBeenCalledWith(mockExercise);
    });

    it('maneja errores al crear ejercicio', async () => {
      const mockError = new Error('Error al crear ejercicio');
      (supabase.from().insert as jest.Mock).mockRejectedValueOnce(mockError);

      await expect(exerciseService.createExercise(mockExercise)).rejects.toThrow(
        'Error al crear ejercicio'
      );
    });
  });

  describe('updateExercise', () => {
    it('actualiza un ejercicio correctamente', async () => {
      const mockResponse = { data: mockExercise, error: null };
      (supabase.from().update as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await exerciseService.updateExercise('1', mockExercise);

      expect(result).toEqual(mockExercise);
      expect(supabase.from).toHaveBeenCalledWith('exercises');
      expect(supabase.from().update).toHaveBeenCalledWith(mockExercise);
      expect(supabase.from().update().eq).toHaveBeenCalledWith('id', '1');
    });
  });

  describe('deleteExercise', () => {
    it('elimina un ejercicio correctamente', async () => {
      const mockResponse = { data: null, error: null };
      (supabase.from().delete as jest.Mock).mockResolvedValueOnce(mockResponse);

      await exerciseService.deleteExercise('1');

      expect(supabase.from).toHaveBeenCalledWith('exercises');
      expect(supabase.from().delete().eq).toHaveBeenCalledWith('id', '1');
    });
  });
});
