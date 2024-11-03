import { updateComment } from './../controllers/commentController';
import Comment, { IComment } from '../models/commentModel';

class CommentRepository {
  findCommentLikes(commentId: string): string[] | PromiseLike<string[]> {
    throw new Error('Method not implemented.');
  }
  async createComment(postId: string, userId: string, text: string, media: string): Promise<IComment> {
    const newComment = new Comment({ post: postId, user: userId, text: text, media: media });
    return await newComment.save();
  }

  async findCommentById(commentId: string): Promise<IComment | null> {
    return await Comment.findById(commentId).populate('user');
  }

  async deleteComment(commentId: string): Promise<IComment | null> {
    return await Comment.findByIdAndDelete(commentId);
  }

  async findCommentsByPost(postId: string, page: number, limit: number): Promise<IComment[]> {
    return await Comment.find({ postId })
      .skip(page)
      .limit(limit)
      .exec();
  } 

  async likeComment(commentId: string, userId: string): Promise<IComment | null> {
    return await Comment.findByIdAndUpdate(
      commentId,
      { $addToSet: { likes: userId } },
      { new: true }
    )
    .populate('user');
  }

  async unlikeComment(commentId: string, userId: string): Promise<IComment | null> {
    return await Comment.findByIdAndUpdate
      (commentId,
      { $pull: { likes: userId } },
      { new: true }
    )
    .populate('user');
  }

  async updateComment(commentId: string, comment: string): Promise<IComment | null> {
    return await Comment.findByIdAndUpdate(commentId, { text: comment }, { new: true });
  }

  
}

export default new CommentRepository();
