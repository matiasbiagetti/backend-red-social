import jwt from 'jsonwebtoken';
import { config } from '../config/environment';

export default function generateJWT(userId: string): string {
  const payload = {
    user: {
      id: userId,
    },
  };

  return jwt.sign(payload, config.JWT_SECRET, { expiresIn: '3h' });
}
