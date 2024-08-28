import userRepository from '../repositories/userRepository';
import bcrypt from 'bcryptjs';
import generateJWT from '../utils/generateJWT';
import sendEmail from '../utils/emailSender';
import { IUser } from '../models/userModel';

class AuthService {
async register(userData: IUser): Promise<string> {
    const userExists = await userRepository.findUserByEmail(userData.email);
    if (userExists) throw new Error('User already exists');

    const user = await userRepository.createUser(userData);
    return generateJWT(user._id as string);
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
}

export default new AuthService();
