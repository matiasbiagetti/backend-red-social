import userRepository from '../repositories/userRepository';
import bcrypt from 'bcryptjs';
import generateJWT from '../utils/generateJWT';
import sendEmail from '../utils/emailSender';
import { IUser } from '../models/userModel';
import { config } from '../config/environment';

export const ErrorUsernameExists = new Error('Username already exists');
export const ErrorEmailExists = new Error('Email already registered');
export const ErrorInvalidCredentials = new Error('Invalid credentials');

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
    if (!user) throw ErrorInvalidCredentials;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw ErrorInvalidCredentials;

    return generateJWT(String(user._id));
  }

  async forgotPassword(email: string): Promise<string> {
    const user = await userRepository.findUserByEmail(email);
    if (!user) throw new Error('User not found');
    const magicLink = `${config.CLIENT_URL}/reset-password?token=${generateJWT(String(user._id), '30m')}`;
    const emailSubject = 'SnapShare - You forgot your password? Do not worry!';
    const emailBody = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Hello ${user.firstName},</h2>
      <p>We received a request to reset your password on SnapShare. If you did not make this request, you can ignore this email.</p>
      <p>To reset your password, please click on the following link:</p>
      <p>
        <a href="${magicLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Reset Password
        </a>
      </p>
      <p>This link is valid for 30 minutes.</p>
      <p>If you have any questions or need assistance, feel free to contact us.</p>
      <p>Thank you,</p>
      <p>The SnapShare Team</p>
    </div>
  `
    await sendEmail(user.email, emailSubject, emailBody);

    return magicLink;
  }

  async resetPassword(userId: string, password: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(password, 10);
    await userRepository.updateUser(userId, { password: hashedPassword });
  }

}

export default new AuthService();
