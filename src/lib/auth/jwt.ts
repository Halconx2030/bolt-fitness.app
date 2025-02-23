import jwt from 'jsonwebtoken';
import { hash, compare } from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET!;

export const generateToken = (userId: number, role: string) => {
  return jwt.sign(
    { userId, role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
};

export const hashPassword = async (password: string) => {
  return hash(password, 10);
};

export const verifyPassword = async (password: string, hash: string) => {
  return compare(password, hash);
}; 