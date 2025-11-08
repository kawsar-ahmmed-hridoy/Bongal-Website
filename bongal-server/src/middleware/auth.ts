import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

interface JwtPayload {
  _id: string;
}

export const protect = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token',
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    req.user = await User.findById(decoded._id).select('-password -verificationCode -verificationCodeExpires');

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }
    req.user.id = req.user._id;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Not authorized, token failed',
    });
  }
};

export const admin = (req: any, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Not authorized as admin',
    });
  }
};
