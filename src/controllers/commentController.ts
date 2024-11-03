import { Request, Response } from 'express';
import commentService from '../services/commentService';
import { AuthRequest } from '../middlewares/authMiddleware';
import { ErrorPostNotFound } from '../services/postService';

export const createComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    
    const comment = await commentService.createComment(req.params.post_id, req.userId!, req.body.text, req.body.media);
    res.status(201).json(comment);
  } catch (err) {
    if (err == ErrorPostNotFound) {
      res.status(404).json({ message: (err as Error).message });
      return
    }
    else{
      res.status(500).json({ message: (err as Error).message });
    }

  }
};

export const getCommentsByPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const postId = req.params.post_id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const comments = await commentService.getCommentsByPost(postId, page, limit);
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const getCommentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const comment = await commentService.getCommentById(req.params.comment_id);
    if (!comment) {
      res.status(404).json({ message: 'Comment not found' });
    } else {
      res.status(200).json(comment);
    }
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
}
};

export const deleteComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedComment = await commentService.deleteComment(req.params.comment_id);
    if (!deletedComment) {
      res.status(404).json({ message: 'Comment not found' });
    } else {
      res.status(200).json({ message: 'Comment deleted successfully' });
    }
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
}
};

export const updateComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedComment = await commentService.updateComment(req.params.comment_id, req.body);
    if (!updatedComment) {
      res.status(404).json({ message: 'Comment not found' });
    } else {
      res.status(200).json(updatedComment);
    }
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
}
};

export const likeComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const likedComment = await commentService.likeComment(req.params.comment_id, req.userId!);
    if (!likedComment) {
      res.status(404).json({ message: 'Comment not found' });
    } else {
      res.status(200).json(likedComment);
    }
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const unlikeComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const unlikedComment = await commentService.unlikeComment(req.params.comment_id, req.userId!);
    if (!unlikedComment) {
      res.status(404).json({ message: 'Comment not found' });
    } else {
      res.status(200).json(unlikedComment);
    }
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const getCommentLikes = async (req: Request, res: Response): Promise<void> => {
  try {
    const likes = await commentService.getCommentLikes(req.params.comment_id);
    res.status(200).json(likes);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};
