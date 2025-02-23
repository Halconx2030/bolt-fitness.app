import { render, screen, act } from '@testing-library/react';
import { Toast } from './Toast';
import { useToast } from '@/hooks/useToast';

// Mock del hook useToast
jest.mock('@/hooks/useToast', () => ({
  useToast: jest.fn(),
}));

describe('Toast', () => {
  beforeEach(() => {
    (useToast as jest.Mock).mockReturnValue({
      message: '',
      type: 'info',
      isVisible: false,
      showToast: jest.fn(),
      hideToast: jest.fn(),
    });
  });

  it('no renderiza nada cuando no es visible', () => {
    const { container } = render(<Toast />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renderiza el mensaje cuando es visible', () => {
    (useToast as jest.Mock).mockReturnValue({
      message: 'Test message',
      type: 'success',
      isVisible: true,
      hideToast: jest.fn(),
    });

    render(<Toast />);
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('aplica la clase correcta según el tipo', () => {
    (useToast as jest.Mock).mockReturnValue({
      message: 'Test message',
      type: 'error',
      isVisible: true,
      hideToast: jest.fn(),
    });

    const { container } = render(<Toast />);
    expect(container.firstChild).toHaveClass('bg-red-500');
  });

  it('se oculta después del tiempo establecido', () => {
    jest.useFakeTimers();
    const hideToast = jest
      .fn()(useToast as jest.Mock)
      .mockReturnValue({
        message: 'Test message',
        type: 'info',
        isVisible: true,
        hideToast,
      });

    render(<Toast />);

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(hideToast).toHaveBeenCalled();
    jest.useRealTimers();
  });
});
