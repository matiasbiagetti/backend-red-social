import { Request, Response } from 'express';
import commentService from '../services/commentService';

export const createComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const comment = await commentService.createComment(req.body);
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
}
};

export const getCommentsByPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const comments = await commentService.getCommentsByPost(req.params.post_id);
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
