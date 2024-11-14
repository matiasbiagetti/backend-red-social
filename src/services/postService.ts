import postRepository from '../repositories/postRepository';
import { IPost } from '../models/postModel';
import { Types } from 'mongoose';
import userRepository from '../repositories/userRepository';
import updateTier from '../utils/tierCalculator';
import { uploadMediaToCloudinary } from '../utils/cloudinary';

export const ErrorPostNotFound = new Error('Post not found');



class PostService {
  async createPost(userid: string, data: IPost): Promise<IPost> {
    // Ensure media is an array of base64 strings
    if (!Array.isArray(data.media) || data.media.length > 3) {
      throw new Error('You can upload a maximum of 3 media files');
    }

    // Upload media to Cloudinary and get URLs
    const urls = await uploadMediaToCloudinary(data.media);
    data.media = urls;

    // Create the post
    const post = await postRepository.createPost(data);

    // Update user tier and add post ID to user's posts array
    let user = await userRepository.findUserById(userid);
    if (!user) {
      throw new Error('User not found');
    }
    user.posts.push(post._id);
    user.tier = await updateTier(userid);
    await user.save();

    return post;
  }

  async getPostById(postId: string): Promise<IPost | null> {
    return await postRepository.findPostById(postId);
  }

  async getPostsByUsers(userIds: Types.ObjectId[], limit: number, page: number) : Promise<IPost[]> {
    return await postRepository.findPostsByUsers(userIds, limit, page);
  };

  async updatePost(postId: string, data: Partial<IPost>): Promise<IPost | null> {
    return await postRepository.updatePost(postId, data);
  }

  async deletePost(postId: string): Promise<IPost | null> {
    return await postRepository.deletePost(postId);
  }


  async likePost(postId: string, userId: string): Promise<IPost | null> {
    return await postRepository.likePost(postId, userId);
  }

  async unlikePost(postId: string, userId: string): Promise<IPost | null> {
    return await postRepository.unlikePost(postId, userId);
  }

  async getLikedPosts(userId: string, page: number, limit: number): Promise<IPost[]> {
    console.log('ENTREING SERVICE:', userId);
    return await postRepository.findLikedPosts(userId, page, limit);
  }
}

export default new PostService();
