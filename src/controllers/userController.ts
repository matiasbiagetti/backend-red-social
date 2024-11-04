import { Request, Response } from 'express';
import userService from '../services/userService';
import { AuthRequest } from '../middlewares/authMiddleware';

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

export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log('query:', req.query);        
        // Check if the search query parameter is present
        if (req.query.search !== undefined) {
            const searchQuery = req.query.search as string;

            if (searchQuery.trim() === '') {
                res.status(400).json({ error: 'Search query cannot be empty' });
                return;
            }

            const users = await userService.searchUsers(searchQuery);
            res.status(200).json(users);
            return;
        }

        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
};

export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userIdToUpdate = req.params.user_id;
        const authenticatedUserId = req.userId;
        
        if (userIdToUpdate !== authenticatedUserId) {
            res.status(403).json({ message: 'You are not authorized to update this user' });
            return;
        }

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

export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userIdToDelete = req.params.user_id;
        const authenticatedUserId = req.userId; 

        if (userIdToDelete !== authenticatedUserId) {
            res.status(403).json({ message: 'You are not authorized to delete this user' });
            return;
        }

        const deletedUser = await userService.deleteUser(userIdToDelete);
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

export const followUser = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userIdToFollow = req.params.user_id;
        const authenticatedUserId = req.userId!;

        if (userIdToFollow === authenticatedUserId) {
            res.status(400).json({ message: 'You cannot follow yourself' });
            return;
        }

        const updatedUser = await userService.followUser(authenticatedUserId, userIdToFollow);
        if (!updatedUser) {
            res.status(404).json({ message: 'User not found' });
        } else {
            res.status(200).json(updatedUser);
        }
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
};

export const unfollowUser = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userIdToUnfollow = req.params.user_id;
        const authenticatedUserId = req.userId!;
        
        if (userIdToUnfollow === authenticatedUserId) {
            res.status(400).json({ message: 'You cannot unfollow yourself' });
            return;
        }

        const updatedUser = await userService.unfollowUser(authenticatedUserId, userIdToUnfollow);
        if (!updatedUser) {
            res.status(404).json({ message: 'User not found' });
        } else {
            res.status(200).json(updatedUser);
        }
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
};



