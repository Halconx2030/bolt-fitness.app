import { renderHook, act } from '@testing-library/react';
import { useNotifications } from './useNotifications';

describe('useNotifications', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('inicia con estado vacío', () => {
    const { result } = renderHook(() => useNotifications());

    expect(result.current.notifications).toEqual([]);
    expect(result.current.unreadCount).toBe(0);
  });

  it('agrega una notificación correctamente', () => {
    const { result } = renderHook(() => useNotifications());

    act(() => {
      result.current.addNotification({
        id: '1',
        message: 'Test notification',
        type: 'info',
      });
    });

    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.unreadCount).toBe(1);
  });

  it('marca notificación como leída', () => {
    const { result } = renderHook(() => useNotifications());

    act(() => {
      result.current.addNotification({
        id: '1',
        message: 'Test notification',
        type: 'info',
      });
    });

    act(() => {
      result.current.markAsRead('1');
    });

    expect(result.current.unreadCount).toBe(0);
  });

  it('elimina notificación correctamente', () => {
    const { result } = renderHook(() => useNotifications());

    act(() => {
      result.current.addNotification({
        id: '1',
        message: 'Test notification',
        type: 'info',
      });
    });

    act(() => {
      result.current.removeNotification('1');
    });

    expect(result.current.notifications).toHaveLength(0);
  });
});
