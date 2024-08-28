import { Router } from 'express';
import { getUser, updateUser, deleteUser, searchUsers } from '../controllers/userController';
import authMiddleware from '../middlewares/authMiddleware';

const router: Router = Router();

// User routes
router.get('/:user_id', authMiddleware, getUser);
router.patch('/:user_id', authMiddleware, updateUser);
router.delete('/:user_id', authMiddleware, deleteUser);
router.get('/search', authMiddleware, searchUsers);

export default router;
