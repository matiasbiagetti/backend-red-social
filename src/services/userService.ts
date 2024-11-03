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

  async searchUsers(searchQuery: string): Promise<IUser[]> {
    return await userRepository.searchUsers(searchQuery);
  }

  async getAllUsers() {
    return await userRepository.getAllUsers(); // Example using Mongoose
  }
}



export default new UserService();
