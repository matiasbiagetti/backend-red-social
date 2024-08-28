import postRepository from '../repositories/postRepository';
import { IPost } from '../models/postModel';

class PostService {
  async createPost(data: IPost): Promise<IPost> {
    return await postRepository.createPost(data);
  }

  async getPostById(postId: string): Promise<IPost | null> {
    return await postRepository.findPostById(postId);
  }

  async updatePost(postId: string, data: Partial<IPost>): Promise<IPost | null> {
    return await postRepository.updatePost(postId, data);
  }

  async deletePost(postId: string): Promise<IPost | null> {
    return await postRepository.deletePost(postId);
  }

  async getPostsPaginated(page: number, limit: number): Promise<IPost[]> {
    return await postRepository.findPostsPaginated(page, limit);
  }

  async likePost(postId: string, userId: string): Promise<IPost | null> {
    return await postRepository.likePost(postId, userId);
  }

  async unlikePost(postId: string, userId: string): Promise<IPost | null> {
    return await postRepository.unlikePost(postId, userId);
  }
}

export default new PostService();
