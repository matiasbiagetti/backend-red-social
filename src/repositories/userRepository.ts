import { verifyEmail } from './../controllers/authController';
import User, { IUser } from '../models/userModel';

class UserRepository {
  async createUser(data: IUser): Promise<IUser> {
    const user = new User(data);
    return await user.save();
  }

  async findUserByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email })
      .populate('followers', '_id firstName lastName username tier profileImage')
      .populate('following', '_id firstName lastName username tier profileImage')
      .populate('posts', '_id text media createdAt updatedAt likes comments').populate('likes', '_id username profileImage').populate('comments', '_id text media createdAt updatedAt likes');
  }

  async findUserByUsername(username: string): Promise<IUser | null> {
    return await User.findOne({ username })
      .populate('followers', '_id firstName lastName username tier profileImage')
      .populate('following', '_id firstName lastName username tier profileImage')
      .populate('posts', '_id text media createdAt updatedAt likes comments').populate('likes', '_id username profileImage').populate('comments', '_id text media createdAt updatedAt likes');

  }

  async findUserById(userId: string): Promise<IUser | null> {
    return await User.findById(userId)
      .populate('followers', '_id firstName lastName username tier profileImage bio')
      .populate('following', '_id firstName lastName username tier profileImage bio')
      .populate('posts', '_id text media createdAt updatedAt likes comments').populate('likes', '_id username profileImage').populate('comments', '_id text media createdAt updatedAt likes');

  }

  async updateUser(userId: string, data: Partial<IUser>): Promise<IUser | null> {
    return await User.findByIdAndUpdate(userId, data, { new: true })
      .populate('followers', '_id firstName lastName username tier profileImage')
      .populate('following', '_id firstName lastName username tier profileImage')
      .populate('posts', '_id text media createdAt updatedAt likes comments').populate('likes', '_id username profileImage').populate('comments', '_id text media createdAt updatedAt likes');

  }

  async deleteUser(userId: string): Promise<IUser | null> {
    return await User.findByIdAndDelete(userId);
  }

  async searchUsers(searchQuery: string): Promise<IUser[]> {
    const query = String(searchQuery); 

    const users = await User.find({
      $or: [
        { firstName: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { username: { $regex: query, $options: 'i' } }
      ]
    })
      .populate('followers', '_id firstName lastName username tier profileImage')
      .populate('following', '_id firstName lastName username tier profileImage')
      .populate('posts', '_id text media createdAt updatedAt likes comments').populate('likes', '_id username profileImage').populate('comments', '_id text media createdAt updatedAt likes')
      .exec();
    return users;
  }

  async followUser(userId: string, userToFollow: string): Promise<IUser | null> {
    const user = await User.findByIdAndUpdate(userToFollow, { $addToSet: { followers: userId } }, { new: true })
      .populate('followers', '_id firstName lastName username tier profileImage')
      .populate('following', '_id firstName lastName username tier profileImage')
      .populate('posts', '_id text media createdAt updatedAt likes comments').populate('likes', '_id username profileImage').populate('comments', '_id text media createdAt updatedAt likes')


    await User.findByIdAndUpdate(userId, { $push: { following: userToFollow } });
    return user;
  }

  async unfollowUser(userId: string, userToUnfollow: string): Promise<IUser | null> {
    const user = await User.findByIdAndUpdate(userToUnfollow, { $pull: { followers: userId } }, { new: true })
      .populate('followers', '_id firstName lastName username tier profileImage')
      .populate('following', '_id firstName lastName username tier profileImage')
      .populate('posts', '_id text media createdAt updatedAt likes comments').populate('likes', '_id username profileImage').populate('comments', '_id text media createdAt updatedAt likes')

    await User.findByIdAndUpdate(userId, { $pull: { following: userToUnfollow } });
    return user
  }

  async getAllUsers(): Promise<IUser[]> {
    return await User.find()
      .populate('followers', '_id firstName lastName username tier profileImage')
      .populate('following', '_id firstName lastName username tier profileImage')
      .populate('posts', '_id text media createdAt updatedAt likes comments').populate('likes', '_id username profileImage').populate('comments', '_id text media createdAt updatedAt likes')
  }

  async verifyEmail(userId: string): Promise<IUser | null> {
    return await User.findByIdAndUpdate(userId, { isEmailVerified: true }, { new: true })
      .populate('followers', '_id firstName lastName username tier profileImage')
      .populate('following', '_id firstName lastName username tier profileImage')
      .populate('posts', '_id text media createdAt updatedAt likes comments').populate('likes', '_id username profileImage').populate('comments', '_id text media createdAt updatedAt likes')
  }
}

export default new UserRepository();
