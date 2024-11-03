import { Types } from 'mongoose';
import Post, { IPost } from '../models/postModel';

class PostRepository {
  async createPost(data: IPost): Promise<IPost> {
    const post = new Post(data);
    return await post.save();
  }

  async findPostById(postId: string): Promise<IPost | null> {
    return await Post.findById(postId).populate('user');
  }

  async updatePost(postId: string, data: Partial<IPost>): Promise<IPost | null> {
    return await Post.findByIdAndUpdate(postId, data, { new: true }).populate('user');
  }

  async deletePost(postId: string): Promise<IPost | null> {
    return await Post.findByIdAndDelete(postId);
  }

  async findPostsByUsers(userIds: Types.ObjectId[], limit: number, page: number): Promise<IPost[]> {
    return Post.find({ user: { $in: userIds } })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(page)
    .exec();
  }

  async likePost(postId: string, userId: string): Promise<IPost | null> {
    return await Post.findByIdAndUpdate(
      postId,
      { $addToSet: { likes: userId } },
      { new: true }
    );
  }

  async unlikePost(postId: string, userId: string): Promise<IPost | null> {
    return await Post.findByIdAndUpdate(
      postId,
      { $pull: { likes: userId } },
      { new: true }
    );
  }
}

export default new PostRepository();
