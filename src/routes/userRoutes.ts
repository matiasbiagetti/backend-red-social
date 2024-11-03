import { Router } from 'express';
import { getUser, updateUser, deleteUser, searchUsers, getUsers, followUser, unfollowUser } from '../controllers/userController';
import authMiddleware from '../middlewares/authMiddleware';
import { getPostsByUser } from '../controllers/postController';

const router: Router = Router();

// User routes
router.get('/:user_id', authMiddleware, getUser);
router.patch('/:user_id', authMiddleware, updateUser);
router.delete('/:user_id', authMiddleware, deleteUser);
router.get('/:user_id/posts', authMiddleware, getPostsByUser);
router.get('', getUsers);

// Follow
router.post('/:user_id/follow', authMiddleware, followUser);
router.delete('/:user_id/follow', authMiddleware, unfollowUser);

export default router;