import userRepository from '../repositories/userRepository';
import bcrypt from 'bcryptjs';
import generateJWT from '../utils/generateJWT';
import sendEmail from '../utils/emailSender';
import { IUser } from '../models/userModel';

export const ErrorUsernameExists = new Error('Username already exists');
export const ErrorEmailExists = new Error('Email already registered');
const ErrorInvalidCredentials = new Error('Invalid credentials');
const ErrorUserNotFound = new Error('User not found');

class AuthService {
  async register(userData: IUser): Promise<string> {
    let userExists = await userRepository.findUserByEmail(userData.email);
    if (userExists) throw ErrorEmailExists;

    userExists = await userRepository.findUserByUsername(userData.username);
    if (userExists) throw ErrorUsernameExists;

    const user = await userRepository.createUser(userData);
    return generateJWT(user._id as unknown as string);
  }

  async login(email: string, password: string): Promise<string> {
    const user = await userRepository.findUserByEmail(email);
    if (!user) throw new Error('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');

    return generateJWT(String(user._id));
  }

  async forgotPassword(email: string): Promise<string> {
    const user = await userRepository.findUserByEmail(email);
    if (!user) throw new Error('User not found');

    const magicLink = `${process.env.CLIENT_URL}/reset-password?token=${generateJWT(String(user._id))}`;
    await sendEmail(user.email, 'Password Reset', `Click here to reset your password: ${magicLink}`);

    return magicLink;
  }

  async resetPassword(userId: string, password: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(password, 10);
    await userRepository.updateUser(userId, { password: hashedPassword });
  }

}

export default new AuthService();
