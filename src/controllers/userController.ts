import { Request, Response } from 'express';
import userService from '../services/userService';

export const getUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await userService.getUserById(req.params.user_id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
        } else {
            res.status(200).json(user);
        }
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const updatedUser = await userService.updateUser(req.params.user_id, req.body);
        if (!updatedUser) {
            res.status(404).json({ message: 'User not found' });
        } else {
            res.status(200).json(updatedUser);
        }
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const deletedUser = await userService.deleteUser(req.params.user_id);
        if (!deletedUser) {
            res.status(404).json({ message: 'User not found' });
        } else {
            res.status(200).json({ message: 'User deleted successfully' });
        }
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
};

export const searchUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await userService.searchUsers(req.query.q as string);
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
};
