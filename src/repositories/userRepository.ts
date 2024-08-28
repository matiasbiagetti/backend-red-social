import User, { IUser } from '../models/userModel';

class UserRepository {
  async createUser(data: IUser): Promise<IUser> {
    const user = new User(data);
    return await user.save();
  }

  async findUserByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }

  async findUserById(userId: string): Promise<IUser | null> {
    return await User.findById(userId);
  }

  async updateUser(userId: string, data: Partial<IUser>): Promise<IUser | null> {
    return await User.findByIdAndUpdate(userId, data, { new: true });
  }

  async deleteUser(userId: string): Promise<IUser | null> {
    return await User.findByIdAndDelete(userId);
  }

  async searchUsers(query: string): Promise<IUser[]> {
    return await User.find({ username: new RegExp(query, 'i') });
  }
}

export default new UserRepository();
