import { Router } from 'express';
import {
  createComment,
  getCommentsByPost,
  getCommentById,
  deleteComment
} from '../controllers/commentController';
import authMiddleware from '../middlewares/authMiddleware';

const router: Router = Router();

router.post('/', authMiddleware, createComment);
router.get('/post/:post_id', getCommentsByPost);
router.get('/:comment_id', getCommentById);
router.delete('/:comment_id', authMiddleware, deleteComment);

export default router;
