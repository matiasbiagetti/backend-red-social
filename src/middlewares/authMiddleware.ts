import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';


export interface AuthRequest extends Request {
    userId?: string;
  }

  export default function (req: AuthRequest, res: Response, next: NextFunction): void {
    const token = req.header('x-auth-token')?.replace('Bearer ', '');

    console.log(token);
  
    if (!token) {
      res.status(401).json({ msg: 'No token, authorization denied' });
      return;
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

      req.userId = decoded.userId; 
      next();
    } catch (err) {
      res.status(401).json({ msg: 'Token is not valid or expired' });
    }
  };
