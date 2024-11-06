import { Request, Response } from 'express';
import authService, { ErrorEmailExists, ErrorInvalidCredentials, ErrorUsernameExists } from '../services/authService';
import jwt from 'jsonwebtoken';
import { config } from '../config/environment';

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const {accessToken, refreshToken} = await authService.register(req.body);
        res.status(201).json({ accessToken, refreshToken });
    } catch (err) {
        if (err == ErrorEmailExists) {
            res.status(409).json({ error: (err as Error).message });
            return
        } else if (err == ErrorUsernameExists) {
            res.status(409).json({ error: (err as Error).message });
            return
        } else {
            res.status(500).json({ error: (err as Error).message });
            return
        }
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        const {accessToken, refreshToken} = await authService.login(email, password);
        res.status(200).json({ access_token: accessToken, refresh_token: refreshToken });
        return
    } catch (err) {
        if (err == ErrorInvalidCredentials) {
            res.status(401).json({ error: (err as Error).message });
            return;
        }
        res.status(500).json({ error: (err as Error).message });
        return
    }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;
        const magicLink = await authService.forgotPassword(email);
        res.status(200).json({ message: 'Password reset link sent', magicLink });
        return
    } catch (err) {
        res.status(400).json({ error: (err as Error).message });
        return 
    }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { token, password } = req.body;
        const decoded = jwt.verify(token, config.JWT_SECRET) as unknown as { userId: string };

        await authService.resetPassword(decoded.userId, password);
        res.status(200).json({ message: 'Password reset successfully' });
        return
    } catch (err) {
        res.status(400).json({ error: (err as Error).message });
        return
    }
}

export const refreshTokens = async (req: Request, res: Response): Promise<void> => {
    const { token } = req.body;
  
    if (!token) {
      res.status(401).json({ message: 'Refresh token is required' });
      return;
    }
  
    try {
      const tokens = await authService.refreshTokenService(token);
      if (!tokens) {
        res.status(403).json({ message: 'Invalid refresh token' });
        return;
      }
  
      const { accessToken, refreshToken } = tokens;
      res.json({ access_token: accessToken, refresh_token: refreshToken });
      return;
    } catch (error) {
      console.error('Error in refresh token:', error);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  };


