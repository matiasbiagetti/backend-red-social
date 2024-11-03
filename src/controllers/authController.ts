import { Request, Response } from 'express';
import authService, { ErrorEmailExists, ErrorUsernameExists } from '../services/authService';

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const token = await authService.register(req.body);
        res.status(201).json({ token });
    } catch (err) {
        if (err == ErrorEmailExists) {
            res.status(409).json({ error: (err as Error).message });
        } else if (err == ErrorUsernameExists) {
            res.status(409).json({ error: (err as Error).message });
        } else {
            res.status(500).json({ error: (err as Error).message });
        }
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        const token = await authService.login(email, password);
        res.status(200).json({ token });
    } catch (err: unknown) {
        res.status(400).json({ error: (err as Error).message });
    }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;
        const magicLink = await authService.forgotPassword(email);
        res.status(200).json({ message: 'Password reset link sent', magicLink });
    } catch (err) {
        res.status(400).json({ error: (err as Error).message });
    }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, password } = req.body;
        await authService.resetPassword(userId, password);
        res.status(200).json({ message: 'Password reset successfully' });
    } catch (err) {
        res.status(400).json({ error: (err as Error).message });
    }
};
