import User, { IUser } from '../models/User';
import { EmailService } from './emailService';
import { generateToken } from '../utils/jwt';

const emailService = new EmailService();

export class AuthService {
  async register(userData: {
    name: string;
    email: string;
    password: string;
    phone: string;
    address?: string;
  }) {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const codeExpiry = new Date(Date.now() + 15 * 60 * 1000);

    const user = await User.create({
      ...userData,
      isVerified: false,
      verificationCode,
      verificationCodeExpires: codeExpiry,
    });

    await emailService.sendVerificationEmail(
      user.email,
      `Your verification code is: ${verificationCode}`
    );

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        avatar: user.avatar,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      message: 'Registration successful. A verification code has been sent to your email.',
    };
  }

  async verifyCode(email: string, code: string) {
    const user = await User.findOne({
      email,
      verificationCode: code,
      verificationCodeExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new Error('Invalid or expired verification code');
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();

    return { message: 'Email verified successfully' };
  }

  async login(email: string, password: string) {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (!user.isVerified) {
      throw new Error('Please verify your email first');
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const token = generateToken(user.id.toString());

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        avatar: user.avatar,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      token,
    };
  }

  async getUserById(id: string) {
    const user = await User.findById(id).select('-password -verificationCode -verificationCodeExpires');
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async getUserByEmail(email: string) {
    const user = await User.findOne({ email }).select('-password -verificationCode -verificationCodeExpires');
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}
