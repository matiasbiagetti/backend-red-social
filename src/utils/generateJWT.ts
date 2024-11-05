import jwt from 'jsonwebtoken';
import { config } from '../config/environment';

export default function generateJWT(userId: string, expires: string = '3h'): string {
  return jwt.sign({ userId }, config.JWT_SECRET, { expiresIn: expires });
}

export function generateRefreshToken(userId: string): string {
  return generateJWT(userId, '90d');
}
