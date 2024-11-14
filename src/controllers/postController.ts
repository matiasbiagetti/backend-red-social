import { Request, Response } from 'express';
import postService from '../services/postService';
import mongoose, { Types } from 'mongoose';

import { AuthRequest } from '../middlewares/authMiddleware';
import userService from '../services/userService';

export const createPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId; 
    if (!userId) {
      res.status(400).json({ msg: 'User information is missing' });
      return;
    }

    const post = await postService.createPost(userId,{ 
      ...req.body, 
      user: Types.ObjectId.createFromHexString(userId) 
    });
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

export const getPostsByUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.user_id;
    const limit = parseInt(req.query.limit as string) || 10;
    const page = parseInt(req.query.page as string) || 1;
    const userIdObj = Types.ObjectId.createFromHexString(userId);
    const posts = await postService.getPostsByUsers([userIdObj], limit, page);
    res.status(200).json(posts || []);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const getPosts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    
    // Fetch the list of users the current user follows
    const user = await userService.getUserById(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const followedUserIds = user.following.map((user) => user.id.toString());
    followedUserIds.push(userId);
    console.log(followedUserIds);
    const followedUserObjectIds = followedUserIds.map((id) => Types.ObjectId.createFromHexString(id));

    const posts = await postService.getPostsByUsers(followedUserObjectIds, 10, 1);
    res.status(200).json(posts);
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

export const getPostLikes = async (req: Request, res: Response): Promise<void> => {
  try {
    const post = await postService.getPostById(req.params.post_id);
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    let likes = []

    for (let i = 0; i < post.likes.length; i++) {
      const user = await userService.getUserById(post.likes[i].toString());
      if (user) {
        likes.push(user);
      }
    }
    res.status(200).json(likes);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}

export const likePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const likedPost = await postService.likePost(req.params.post_id, req.userId!);
    if (!likedPost) {
      res.status(404).json({ message: 'Post not found' });
    } else {
      res.status(200).json(likedPost);
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const unlikePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const unlikedPost = await postService.unlikePost(req.params.post_id, req.userId!);
    if (!unlikedPost) {
      res.status(404).json({ message: 'Post not found' });
    } else {
      res.status(200).json(unlikedPost);
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export const getLikedPosts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const posts = await postService.getLikedPosts(req.userId!, page, limit);
    res.status(200).json(posts);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}