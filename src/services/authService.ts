import { ErrorEmailExists } from './authService';
import userRepository from '../repositories/userRepository';
import bcrypt from 'bcryptjs';
import generateJWT, { generateRefreshToken } from '../utils/generateJWT';
import sendEmail from '../utils/emailSender';
import User, { IUser } from '../models/userModel';
import { config } from '../config/environment';
import jwt from 'jsonwebtoken';
import { format, parse } from 'date-fns';

export const ErrorUsernameExists = new Error('Username already exists');
export const ErrorEmailExists = new Error('Email already registered');
export const ErrorInvalidCredentials = new Error('Invalid credentials');
export const ErrorInvalidOldPassword = new Error('Invalid old password');
export const ErrorEmailNotVerified = new Error('Email not verified');

class AuthService {
  async register(userData: IUser): Promise<{id: string }> {
    let userExists = await userRepository.findUserByEmail(userData.email);
    if (userExists) throw ErrorEmailExists;

    userExists = await userRepository.findUserByUsername(userData.username);
    if (userExists) throw ErrorUsernameExists;

    // Ensure birthdate is a string
    if (typeof userData.birthdate === 'string') {
      // Parse the birthdate from dd/MM/yyyy to a Date object
      const parsedBirthdate = parse(userData.birthdate, 'dd/MM/yyyy', new Date());
      userData.birthdate = parsedBirthdate;
    } else {
      throw new Error('Invalid birthdate format');
    }

    const user = await userRepository.createUser(userData);

    this.sendVerificationEmail(String(user._id));

    await user.save();

    return {id: String(user._id) };
  }

  async login(email: string, password: string): Promise<{ accessToken: string, refreshToken: string, id: string }> {
    const user = await userRepository.findUserByEmail(email);
    if (!user) throw ErrorInvalidCredentials;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw ErrorInvalidCredentials;

    if (!user.isEmailVerified) {
      throw ErrorEmailNotVerified;
    }

    const accessToken = generateJWT(String(user._id));
    const refreshToken = generateRefreshToken(String(user._id));
    user.refreshToken = refreshToken;
    await user.save();

    return { accessToken, refreshToken, id: String(user._id) };
  }

  async forgotPassword(email: string): Promise<string> {
    const user = await userRepository.findUserByEmail(email);
    if (!user) {
      return '';
    } 
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
  `;
    await sendEmail(user.email, emailSubject, emailBody);

    return magicLink;
  }

  async resetPassword(userId: string, password: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(password, 10);
    await userRepository.updateUser(userId, { password: hashedPassword });
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    const user = await userRepository.findUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw ErrorInvalidOldPassword;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userRepository.updateUser(userId, { password: hashedPassword });
  }

  async refreshTokenService(refreshToken: string): Promise<{ accessToken: string, refreshToken: string, id: string } | null> {
    const user = await User.findOne({ refreshToken });
    if (!user) {
      return null;
    }
  
    return new Promise((resolve, reject) => {
      jwt.verify(refreshToken, config.JWT_SECRET as string, async (err: any, decoded: any) => {
        if (err || !decoded || typeof decoded !== 'object' || !('userId' in decoded)) {
          return reject(new Error('Invalid refresh token'));
        }
  
        const newAccessToken = generateJWT(String(user._id));
        const newRefreshToken = generateRefreshToken(String(user._id));
        user.refreshToken = newRefreshToken;
        await user.save();
  
        resolve({ accessToken: newAccessToken, refreshToken: newRefreshToken, id: String(user._id) });
      });
    });
  }

  async sendVerificationEmail(userId: string): Promise<void> {
    const user = await userRepository.findUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const magicLink = `${config.CLIENT_URL}/verify-email?token=${generateJWT(String(user._id), '1d')}`;
    const emailSubject = 'SnapShare - Verify your email address';
    const emailBody = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Hello ${user.firstName},</h2>
      <p>Welcome to SnapShare! To get started, please verify your email address by clicking the button below.</p>
      <p>
        <a href="${magicLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Verify Email
        </a>
      </p>
      <p>This link is valid for 24 hours.</p>
      <p>If you have any questions or need assistance, feel free to contact us.</p>
      <p>Thank you,</p>
      <p>The SnapShare Team</p>
    </div>
  `;
    await sendEmail(user.email, emailSubject, emailBody);
  }
}

export default new AuthService();