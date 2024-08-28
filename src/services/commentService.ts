import commentRepository from '../repositories/commentRepository';
import { IComment } from '../models/commentModel';

class CommentService {
  async createComment(data: IComment): Promise<IComment> {
    return await commentRepository.createComment(data);
  }

  async getCommentById(commentId: string): Promise<IComment | null> {
    return await commentRepository.findCommentById(commentId);
  }

  async deleteComment(commentId: string): Promise<IComment | null> {
    return await commentRepository.deleteComment(commentId);
  }

  async getCommentsByPost(postId: string): Promise<IComment[]> {
    return await commentRepository.findCommentsByPost(postId);
  }
}

export default new CommentService();
