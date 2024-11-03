import { deleteComment, getCommentById, getCommentLikes, likeComment, unlikeComment, updateComment } from './../controllers/commentController';
import { Router } from 'express';
import {
  createPost,
  getPostById,
  updatePost,
  deletePost,
  getPostLikes,
  likePost,
  unlikePost,
  getPostsByUser
} from '../controllers/postController';
import authMiddleware from '../middlewares/authMiddleware';
import { createComment, getCommentsByPost } from '../controllers/commentController';

const router: Router = Router();

// Post routes
router.post('/', authMiddleware, createPost);
router.get('/:post_id', authMiddleware, getPostById);
router.patch('/:post_id', authMiddleware, updatePost);
router.delete('/:post_id', authMiddleware, deletePost);
router.get('/', authMiddleware, getPostsByUser);
router.post('/:post_id/likes', authMiddleware, likePost);
router.delete('/:post_id/likes', authMiddleware, unlikePost);
router.get('/:post_id/likes', authMiddleware, getPostLikes);

// Comments routes
router.post('/:post_id/comments', authMiddleware, createComment);
router.get('/:post_id/comments',authMiddleware, getCommentsByPost);
router.get('/:post_id/comments/:comment_id', getCommentById);
router.patch('/:post_id/comments/:comment_id', authMiddleware, updateComment);
router.delete('/:post_id/comments/:comment_id', authMiddleware, deleteComment);
router.post('/:post_id/comments/:comment_id/likes', authMiddleware, likeComment);
router.delete('/:post_id/comments/:comment_id/likes', authMiddleware, unlikeComment);
router.get('/:post_id/comments/:comment_id/likes', authMiddleware, getCommentLikes);

export default router;
