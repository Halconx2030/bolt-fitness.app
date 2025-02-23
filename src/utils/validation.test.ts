import { validateEmail, validatePassword } from './validation';

describe('Validation Utils', () => {
  describe('validateEmail', () => {
    it('validates correct email formats', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('rejects incorrect email formats', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('validates correct password formats', () => {
      expect(validatePassword('StrongPass123!')).toBe(true);
      expect(validatePassword('AnotherValid1!')).toBe(true);
    });

    it('rejects weak passwords', () => {
      expect(validatePassword('weak')).toBe(false);
      expect(validatePassword('123456')).toBe(false);
      expect(validatePassword('nouppercaseornumber')).toBe(false);
    });
  });
});
