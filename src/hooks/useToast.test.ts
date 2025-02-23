import { renderHook, act } from '@testing-library/react-hooks';
import { useToast } from './useToast';

describe('useToast', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('muestra y oculta el toast', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.showToast('Test message', 'success');
    });

    expect(result.current.isVisible).toBe(true);
    expect(result.current.message).toBe('Test message');
    expect(result.current.type).toBe('success');

    jest.advanceTimersByTime(3000);

    expect(result.current.isVisible).toBe(false);
  });

  it('permite ocultar el toast manualmente', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.showToast('Test message', 'error');
    });

    expect(result.current.isVisible).toBe(true);

    act(() => {
      result.current.hideToast();
    });

    expect(result.current.isVisible).toBe(false);
  });
});
