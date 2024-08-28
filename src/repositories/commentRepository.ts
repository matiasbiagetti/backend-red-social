import Comment, { IComment } from '../models/commentModel';

class CommentRepository {
  async createComment(data: IComment): Promise<IComment> {
    const comment = new Comment(data);
    return await comment.save();
  }

  async findCommentById(commentId: string): Promise<IComment | null> {
    return await Comment.findById(commentId).populate('user');
  }

  async deleteComment(commentId: string): Promise<IComment | null> {
    return await Comment.findByIdAndDelete(commentId);
  }

  async findCommentsByPost(postId: string): Promise<IComment[]> {
    return await Comment.find({ post: postId }).populate('user').sort({ createdAt: -1 });
  }
}

export default new CommentRepository();
