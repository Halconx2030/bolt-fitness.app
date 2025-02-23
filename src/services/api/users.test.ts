import { userService } from './users';
import { supabase } from '@/lib/supabase';

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockReturnThis(),
    })),
  },
}));

describe('userService', () => {
  const mockUser = {
    id: '1',
    email: 'test@example.com',
    name: 'Usuario Test',
    role: 'user',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserProfile', () => {
    it('obtiene el perfil del usuario correctamente', async () => {
      const mockResponse = { data: mockUser, error: null };
      (supabase.from().select().single as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await userService.getUserProfile('1');

      expect(result).toEqual(mockUser);
      expect(supabase.from).toHaveBeenCalledWith('profiles');
      expect(supabase.from().select().eq).toHaveBeenCalledWith('id', '1');
    });

    it('maneja usuario no encontrado', async () => {
      const mockResponse = { data: null, error: null };
      (supabase.from().select().single as jest.Mock).mockResolvedValueOnce(mockResponse);

      await expect(userService.getUserProfile('999')).rejects.toThrow('Usuario no encontrado');
    });
  });

  describe('updateUserProfile', () => {
    it('actualiza el perfil correctamente', async () => {
      const mockResponse = { data: mockUser, error: null };
      (supabase.from().update as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await userService.updateUserProfile('1', { name: 'Nuevo Nombre' });

      expect(result).toEqual(mockUser);
      expect(supabase.from).toHaveBeenCalledWith('profiles');
      expect(supabase.from().update).toHaveBeenCalledWith({ name: 'Nuevo Nombre' });
      expect(supabase.from().update().eq).toHaveBeenCalledWith('id', '1');
    });
  });

  describe('getUserStats', () => {
    it('obtiene las estadísticas del usuario correctamente', async () => {
      const mockStats = {
        totalWorkouts: 10,
        totalTime: 500,
        favoriteExercise: 'Press de Banca',
      };
      const mockResponse = { data: mockStats, error: null };
      (supabase.from().select().single as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await userService.getUserStats('1');

      expect(result).toEqual(mockStats);
      expect(supabase.from).toHaveBeenCalledWith('user_stats');
      expect(supabase.from().select().eq).toHaveBeenCalledWith('user_id', '1');
    });
  });

  describe('updateUserPreferences', () => {
    it('actualiza las preferencias correctamente', async () => {
      const mockPreferences = { theme: 'dark', notifications: true };
      const mockResponse = { data: mockPreferences, error: null };
      (supabase.from().update as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await userService.updateUserPreferences('1', mockPreferences);

      expect(result).toEqual(mockPreferences);
      expect(supabase.from).toHaveBeenCalledWith('user_preferences');
      expect(supabase.from().update).toHaveBeenCalledWith(mockPreferences);
    });
  });
});
