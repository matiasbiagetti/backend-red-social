import userRepository from '../repositories/userRepository';
import { IUser } from '../models/userModel';

class UserService {
  async getUserById(userId: string): Promise<IUser | null> {
    return await userRepository.findUserById(userId);
  }

  async updateUser(userId: string, data: Partial<IUser>): Promise<IUser | null> {
    return await userRepository.updateUser(userId, data);
  }

  async deleteUser(userId: string): Promise<IUser | null> {
    return await userRepository.deleteUser(userId);
  }

  async searchUsers(query: string): Promise<IUser[]> {
    return await userRepository.searchUsers(query);
  }
}

export default new UserService();
