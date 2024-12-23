import mongoose, { Types } from 'mongoose';
import Post, { IPost } from '../models/postModel';
import User from '../models/userModel';
import userRepository from './userRepository';

class PostRepository {
  async createPost(data: IPost): Promise<IPost> {
    const post = new Post(data);
    return (await post.save()).populate('user', '_id username profileImage');
  }

  async findPostById(postId: string): Promise<IPost | null> {
    return await Post.findById(postId).populate('likes', '_id username')
    .populate('user', '_id username profileImage')
    .populate('comments', '_id text media user likes'); 
  }

  async updatePost(postId: string, data: Partial<IPost>): Promise<IPost | null> {
    return await Post.findByIdAndUpdate(postId, data, { new: true }).populate('likes', '_id username')
    .populate('user', '_id username profileImage')
    .populate('comments', '_id text media user likes');
  }

  async deletePost(postId: string): Promise<IPost | null> {
    return await Post.findByIdAndDelete(postId);
  }

  async findPostsByUsers(userIds: Types.ObjectId[], limit: number, page: number): Promise<IPost[]> {
    const skip = (page - 1) * limit;
    return Post.find({ user: { $in: userIds } })
      .populate('likes', '_id username')
      .populate('user', '_id username profileImage')
      .populate('comments', '_id text media user likes')
      .sort({ createdAt: -1 })
      .limit(30)
      .skip(skip)
      .exec();
  }

  async likePost(postId: string, userId: string): Promise<IPost | null> {
    const post = await Post.findByIdAndUpdate(
      postId,
      { $addToSet: { likes: userId } },
      { new: true }
    ).populate('likes', '_id username')
    .populate('user', '_id username profileImage')
    .populate('comments', '_id text media user likes')

    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { likes: postId } },
      { new: true }
    );

    return post;
    
  }

  async unlikePost(postId: string, userId: string): Promise<IPost | null> {
    const post = await Post.findByIdAndUpdate(
        postId,
        { $pull: { likes: userId } },
        { new: true }
    ).populate('likes', '_id username')
    .populate('user', '_id username profileImage')
    .populate('comments', '_id text media user likes');

    // Ensure the user's `likes` array is updated properly
    await User.findByIdAndUpdate(
        userId,
        { $pull: { likes: postId } },
        { new: true }
    );

    return post;
}

async findLikedPosts(userId: string, page: number, limit: number): Promise<IPost[]> {
  const skip = (page - 1) * limit;

  // Ensure the user's likes array is updated correctly
  const user = await User.findById(userId).exec();
  if (!user) {
      throw new Error('User not found');
  }

  const likesIds = user.likes;
  return await Post.find({ _id: { $in: likesIds } })
      .skip(skip)
      .limit(limit)
      .populate('likes', '_id username')
      .populate('user', '_id username profileImage')
      .populate({
          path: 'comments',
          populate: {
              path: 'user',
              select: '_id username profileImage'
          }
      })
      .exec();
};
}

export default new PostRepository();
