import jwt from 'jsonwebtoken';
import { config } from '../config/environment';

export function generateJWT(userId: string, expiresIn: string = '1h'): string {
  const payload = { userId };
  const options = { expiresIn };
  return jwt.sign(payload, config.JWT_SECRET, options);
}

export function generateRefreshToken(userId: string, expiresIn: string = '30d'): string {
  const payload = { userId };
  const options = { expiresIn };
  return jwt.sign(payload, config.JWT_SECRET, options);
}

export default generateJWT;