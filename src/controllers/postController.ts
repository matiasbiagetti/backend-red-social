import { Request, Response } from 'express';
import postService from '../services/postService';

export const createPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const post = await postService.createPost(req.body);
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
}
};

export const getPostById = async (req: Request, res: Response): Promise<void> => {
  try {
    const post = await postService.getPostById(req.params.post_id);
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
    } else {
      res.status(200).json(post);
    }
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
}
};

export const updatePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedPost = await postService.updatePost(req.params.post_id, req.body);
    if (!updatedPost) {
      res.status(404).json({ message: 'Post not found' });
    } else {
      res.status(200).json(updatedPost);
    }
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
}
};

export const deletePost = async (req: Request, res: Response): Promise<void> => {
    try {
        const deletedPost = await postService.deletePost(req.params.post_id);
        if (!deletedPost) {
            res.status(404).json({ message: 'Post not found' });
        } else {
            res.status(200).json({ message: 'Post deleted successfully' });
        }
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
};

export const getPostsPaginated = async (req: Request, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = 10;
        const posts = await postService.getPostsPaginated(page, limit);
        res.status(200).json(posts);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const likePost = async (req: Request, res: Response): Promise<void> => {
    try {
        const likedPost = await postService.likePost(req.params.post_id, req.body.user_id);
        if (!likedPost) {
            res.status(404).json({ message: 'Post not found' });
        } else {
            res.status(200).json(likedPost);
        }
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const unlikePost = async (req: Request, res: Response): Promise<void> => {
    try {
        const unlikedPost = await postService.unlikePost(req.params.post_id, req.body.user_id);
        if (!unlikedPost) {
            res.status(404).json({ message: 'Post not found' });
        } else {
            res.status(200).json(unlikedPost);
        }
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};
