export const useAuth = jest.fn(() => ({
  user: null,
  loading: false,
  login: jest.fn(),
  logout: jest.fn(),
}));
