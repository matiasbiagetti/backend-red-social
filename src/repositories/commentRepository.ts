import mongoose, { Types } from 'mongoose';
import Comment, { IComment } from '../models/commentModel';
import Post from '../models/postModel';
import User from '../models/userModel';

class CommentRepository {
  findCommentLikes(commentId: string): string[] | PromiseLike<string[]> {
    throw new Error('Method not implemented.');
  }

  async createComment(postId: string, userId: string, text: string, media: string): Promise<IComment> {
    const newComment = new Comment({ text, user: userId, post: postId, media });
    await newComment.save();

    await User.findByIdAndUpdate(
      userId,
      { $push: { comments: newComment._id } },
      { new: true }
    );

    await Post.findByIdAndUpdate(
      postId,
      { $push: { comments: newComment._id } },
      { new: true }
    ).populate('user', '_id username profileImage tier').populate('likes', '_id username profileImage tier');

    return (await newComment.populate('user', '_id username profileImage tier')).populate('likes', '_id username profileImage tier');
  }


  async findCommentById(commentId: string): Promise<IComment | null> {
    
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new Error('Comment not found');
  }

  const deletedComment = await Comment.findByIdAndDelete(commentId);

  await Post.findByIdAndUpdate(
    comment.post,
    { $pull: { comments: commentId } },
    { new: true }
  );

  return deletedComment;  }

  async deleteComment(commentId: string): Promise<IComment | null> {
    return await Comment.findByIdAndDelete(commentId);
  }

  async findCommentsByPost(postId: string, page: number, limit: number): Promise<IComment[]> {
    return await Comment.find({ post: Types.ObjectId.createFromHexString(postId) })
      .populate('user', '_id username profileImage tier')
      .populate('likes', '_id username profileImage tier')
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();
  } 

  async likeComment(commentId: string, userId: string): Promise<IComment | null> {
    return await Comment.findByIdAndUpdate(
      commentId,
      { $addToSet: { likes: userId } },
      { new: true }
    ).populate('user', '_id username profileImage tier');
  }

  async unlikeComment(commentId: string, userId: string): Promise<IComment | null> {
    return await Comment.findByIdAndUpdate
      (commentId,
      { $pull: { likes: userId } },
      { new: true }
    )
    .populate('user', '_id username profileImage tier');
  }

  async updateComment(commentId: string, comment: string): Promise<IComment | null> {
    return await Comment.findByIdAndUpdate(commentId, { text: comment }, { new: true }).populate('user', '_id username profileImage tier');
  }

  
}

export default new CommentRepository();
