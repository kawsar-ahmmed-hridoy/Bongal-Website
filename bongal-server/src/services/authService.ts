import User, {IUser}  from '../models/User';
import { generateToken } from '../utils/jwt';
import crypto from 'crypto';
import { EmailService } from './emailService';
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

    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = await User.create({
      ...userData,
      isVerified: false,
      verificationToken,
    });

    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    await EmailService.sendVerificationEmail(user.email, verificationLink);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      message: 'Registration successful. Please check your email to verify your account.',
    };
  }

  async verifyEmail(token: string) {
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      throw new Error('Invalid or expired verification token');
    }

    user.isVerified = true;
    user.verificationToken = undefined;
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
        role: user.role,
      },
      token,
    };
  }

  async getUserById(id: string) {
    const user = await User.findById(id).select('-password');
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}
