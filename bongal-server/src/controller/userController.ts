import { Request, Response } from 'express';
import User from '../models/User';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select('-password');
    
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
    const { name, phone, address } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, address },
      { new: true, runValidators: true }
    ).select('-password');
    
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
    await User.findByIdAndDelete(req.params.id);
    
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
