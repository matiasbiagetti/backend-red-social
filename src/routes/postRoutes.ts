import { Router } from 'express';
import {
  createPost,
  getPostById,
  updatePost,
  deletePost,
  getPostsPaginated,
  likePost,
  unlikePost
} from '../controllers/postController';
import authMiddleware from '../middlewares/authMiddleware';

const router: Router = Router();

router.post('/', authMiddleware, createPost);
router.get('/:post_id', getPostById);
router.patch('/:post_id', authMiddleware, updatePost);
router.delete('/:post_id', authMiddleware, deletePost);
router.get('/', getPostsPaginated);
router.post('/:post_id/like', authMiddleware, likePost);
router.delete('/:post_id/like', authMiddleware, unlikePost);

export default router;
