import jwt from 'jsonwebtoken';

export default function generateJWT(userId: string): string {
  const payload = {
    user: {
      id: userId,
    },
  };

  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '6h' });
}
