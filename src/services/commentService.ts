import commentRepository from '../repositories/commentRepository';
import { IComment } from '../models/commentModel';
import postRepository from '../repositories/postRepository';
import { ErrorPostNotFound } from './postService';
import userRepository from '../repositories/userRepository';
import updateTier from '../utils/tierCalculator';


class CommentService {
  async createComment(postId: string, userId: string, text: string, media: string): Promise<IComment> {
    const post = await postRepository.findPostById(postId);
    if (!post) {
      throw ErrorPostNotFound;
    }

    let user = await userRepository.findUserById(userId)
    
    const comment = await commentRepository.createComment(postId, userId, text, media)
    user = await userRepository.findUserById(userId)
    if (!user) {
      throw new Error('User not found');
    }
    
    user.tier = await updateTier(userId)
    await user.save()
    return comment;
  }

  async getCommentById(commentId: string): Promise<IComment | null> {
    return await commentRepository.findCommentById(commentId);
  }

  async deleteComment(commentId: string): Promise<IComment | null> {
    return await commentRepository.deleteComment(commentId);
  }

  async getCommentsByPost(postId: string, page: number, limit: number): Promise<IComment[]> {
    return await commentRepository.findCommentsByPost(postId, page, limit);
    }

  async likeComment(commentId: string, userId: string): Promise<IComment | null> {
    return await commentRepository.likeComment(commentId, userId);
  }

  async unlikeComment(commentId: string, userId: string): Promise<IComment | null> {
    return await commentRepository.unlikeComment(commentId, userId);
  }

  async getCommentLikes(commentId: string): Promise<string[]> {
    return await commentRepository.findCommentLikes(commentId);
  }

  async updateComment(commentId: string, comment: string): Promise<IComment | null> {
    return await commentRepository.updateComment(commentId, comment);
  }
}

export default new CommentService();
