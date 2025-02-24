import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Componente que lanza un error para pruebas
const ThrowError = () => {
  throw new Error('Error de prueba');
};

// Mock de console.error para evitar logs durante las pruebas
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalError;
});

describe('ErrorBoundary', () => {
  it('renderiza los children cuando no hay errores', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <div>Contenido normal</div>
      </ErrorBoundary>
    );

    expect(getByText('Contenido normal')).toBeInTheDocument();
  });

  it('muestra el mensaje de error cuando ocurre una excepción', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(getByText('¡Ups! Algo salió mal')).toBeInTheDocument();
    expect(getByText(/Ha ocurrido un error inesperado/)).toBeInTheDocument();
  });

  it('muestra los detalles del error en desarrollo', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    const { getByText } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(getByText('Error: Error de prueba')).toBeInTheDocument();

    process.env.NODE_ENV = originalEnv;
  });

  it('los botones de acción funcionan correctamente', () => {
    // Mock de window.location.reload y window.history.back
    const reloadMock = jest.fn();
    const backMock = jest.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: reloadMock },
      writable: true,
    });
    Object.defineProperty(window, 'history', {
      value: { back: backMock },
      writable: true,
    });

    const { getByText } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    fireEvent.click(getByText('Recargar página'));
    expect(reloadMock).toHaveBeenCalled();

    fireEvent.click(getByText('Volver atrás'));
    expect(backMock).toHaveBeenCalled();
  });
});
