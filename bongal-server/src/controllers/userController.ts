import { Request, Response } from 'express';
import User from '../models/User';

export const getCurrentUser = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user.id).select('-password -verificationCode -verificationCodeExpires');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get user profile',
    });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select('-password -verificationCode -verificationCodeExpires');

    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get users',
    });
  }
};

export const updateProfile = async (req: any, res: Response) => {
  try {
    const { name, email, phone, address, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        name,
        email,// eita baire enabled rakhi nai. but frontend e change kora jabe enable kore
        phone,
        address,
        avatar
      },
      {
        new: true,
        runValidators: true
      }
    ).select('-password -verificationCode -verificationCodeExpires');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update profile',
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete user',
    });
  }
};

// Make user admin (development only)
export const makeAdmin = async (req: any, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { role: 'admin' },
      { new: true }
    ).select('-password -verificationCode -verificationCodeExpires');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      message: 'User role updated to admin',
      user,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update user role',
    });
  }
};
