import { searchUsers } from './../controllers/userController';
import User, { IUser } from '../models/userModel';

class UserRepository {
  async createUser(data: IUser): Promise<IUser> {
    const user = new User(data);
    return await user.save();
  }

  async findUserByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }

  async findUserByUsername(username: string): Promise<IUser | null> {
    return await User.findOne({ username });
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

  async searchUsers(searchQuery: string): Promise<IUser[]> {
    const query = String(searchQuery); // Ensure searchQuery is a string
    console.log(`Executing search with query: ${query}`); // Log the query

    const users = await User.find({
      $or: [
        { firstName: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { username: { $regex: query, $options: 'i' } }
      ]
    }).exec();

    console.log(`Found users: ${JSON.stringify(users)}`); // Log the found users
    return users;
  }

  async getAllUsers() {
    return await User.find();
  }
}

export default new UserRepository();
