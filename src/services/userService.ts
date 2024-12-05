import userRepository from '../repositories/userRepository';
import { IUser } from '../models/userModel';
import { uploadMediaToCloudinary } from '../utils/cloudinary';

class UserService {
  async getUserById(userId: string): Promise<IUser | null> {
    return await userRepository.findUserById(userId);
  }

  async updateUser(userId: string, data: Partial<IUser>): Promise<IUser | null> {
    const userToUpdate = await userRepository.findUserById(userId)
    if (data.coverImage) {
      if (data.coverImage !== userToUpdate.coverImage) {
      let url = await uploadMediaToCloudinary([data.coverImage]);
      console.log('url:', url);
      data.coverImage = url[0];
      }
    }
    if (data.profileImage) {
      if (data.profileImage !== userToUpdate.profileImage) {
      let url = await uploadMediaToCloudinary([data.profileImage]);
      console.log('url:', url);
      data.profileImage = url[0];
      }
    }
    return await userRepository.updateUser(userId, data);
  }

  async deleteUser(userId: string): Promise<IUser | null> {
    return await userRepository.deleteUser(userId);
  }

  async searchUsers(searchQuery: string): Promise<IUser[]> {
    return await userRepository.searchUsers(searchQuery);
  }

  async getAllUsers(): Promise<IUser[]> {
    return await userRepository.getAllUsers();
  }


  async followUser(userId: string, userToFollowId: string): Promise<IUser | null> {
    return await userRepository.followUser(userId, userToFollowId);
  }

  async unfollowUser(userId: string, userToUnfollow: string): Promise<IUser | null> {
    return await userRepository.unfollowUser(userId, userToUnfollow);
  }
}

export default new UserService();
