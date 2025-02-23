/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
import '@testing-library/jest-dom';
import 'whatwg-fetch';

// Mock de next/router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: '',
      asPath: '',
      push: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
      },
    };
  },
}));

// Mock de next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
    };
  },
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock de next/link
jest.mock('next/link', () => {
  const MockLink = function ({ children, ...props }) {
    return <a {...props}>{children}</a>;
  };
  MockLink.displayName = 'MockLink';
  return MockLink;
});

// Mock de Supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn().mockResolvedValue({
        data: { session: null },
        error: null,
      }),
      signInWithPassword: jest.fn().mockResolvedValue({
        data: { user: { email: 'test@example.com' } },
        error: null,
      }),
      signOut: jest.fn().mockResolvedValue({ error: null }),
      onAuthStateChange: jest.fn().mockImplementation(callback => {
        return { unsubscribe: jest.fn() };
      }),
    },
  },
}));

// Mock de date-fns
jest.mock('date-fns', () => ({
  ...jest.requireActual('date-fns'),
  formatDistanceToNow: jest.fn().mockReturnValue('hace menos de un minuto'),
  format: jest.fn().mockReturnValue('20 Jan 2024'),
}));

// Configuración global
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {
    return null;
  }
  unobserve() {
    return null;
  }
  disconnect() {
    return null;
  }
};

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Silenciar warnings específicos
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      /Warning.*not wrapped in act/.test(args[0]) ||
      /Warning.*ReactDOM.render is no longer supported/.test(args[0])
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// Limpiar mocks después de cada prueba
afterEach(() => {
  jest.clearAllMocks();
});
