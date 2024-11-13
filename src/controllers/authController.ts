import { Request, Response } from 'express';
import authService, { ErrorEmailExists, ErrorInvalidCredentials, ErrorInvalidOldPassword, ErrorUsernameExists } from '../services/authService';
import jwt from 'jsonwebtoken';
import { config } from '../config/environment';
import userRepository from '../repositories/userRepository';
import { AuthRequest } from '../middlewares/authMiddleware';

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const {accessToken, refreshToken, id} = await authService.register(req.body);
        res.status(201).json({ accessToken, refreshToken, id });
    } catch (err) {
        if (err == ErrorEmailExists) {
            res.status(409).json({ error: (err as Error).message });
            return
        } else if (err == ErrorUsernameExists) {
            res.status(409).json({ error: (err as Error).message });
            return
        } else {
            console.log(err);
            res.status(500).json({ error: (err as Error).message });
            return
        }
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        const {accessToken, refreshToken, id} = await authService.login(email, password);
        res.status(200).json({ access_token: accessToken, refresh_token: refreshToken, id: id });
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
        res.status(200).json({ message: 'Password reset link sent'});
        return
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
        return 
    }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { token, password } = req.body;
        const decoded = jwt.verify(token, config.JWT_SECRET) as unknown as { userId: string };

        if (!decoded || !('userId' in decoded)) {
            res.status(400).json({ error: 'Invalid token' });
            return
        }

        await authService.resetPassword(decoded.userId, password);
        res.status(200).json({ message: 'Password reset successfully' });
        return
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
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
  
      const { accessToken, refreshToken, id } = tokens;
      res.json({ access_token: accessToken, refresh_token: refreshToken, id: id });
      return;
    } catch (error) {
      console.error('Error in refresh token:', error);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  };

  export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { oldPassword, newPassword } = req.body;
        await authService.changePassword(String(req.userId), oldPassword, newPassword);
        res.status(200).json({ message: 'Password changed successfully' });
        return;
    } catch (error) {
        if (error === ErrorInvalidOldPassword) {
            res.status(400).json({ message: 'Invalid old password' });
            return;
        }
        else {
        console.error('Error in change password:', error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
}
}


  export const logout = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.body;
      await userRepository.updateUser(userId, { refreshToken: null });
      res.status(200).json({ message: 'Logged out successfully' });
      return;
    } catch (error) {
        console.error('Error in logout:', error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
};


