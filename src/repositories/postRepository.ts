import { Types } from 'mongoose';
import Post, { IPost } from '../models/postModel';
import User from '../models/userModel';

class PostRepository {
  async createPost(data: IPost): Promise<IPost> {
    const post = new Post(data);
    return await post.save()
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
      .limit(limit)
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
      { $addToSet: { likedPosts: postId } },
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
    .populate('comments', '_id text media user likes')

    const user = await User.findByIdAndUpdate(userId, { $pull: { likedPosts: postId } }, { new: true });

    return post;
  }

  async findLikedPosts(userId: string, page: number, limit: number): Promise<{ posts: IPost[], total: number, page: number, pages: number }> {
    const skip = (page - 1) * limit;
    const posts = await Post.find({ likes: userId })
      .skip(skip)
      .limit(limit)
      .populate('likes', '_id username')
      .populate('user', '_id username profileImage')
      .populate('comments', '_id text media user likes')
      .exec();

    const total = await Post.countDocuments({ likes: userId });

    return {
      posts,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }
}

export default new PostRepository();
