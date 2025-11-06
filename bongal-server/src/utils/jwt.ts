import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';

const JWT_SECRET: string = process.env.JWT_SECRET!;
const JWT_EXPIRE: string = process.env.JWT_EXPIRE || '7d';

interface TokenPayload {
  _id: string;
}

export const generateToken = (_id: string): string => {
  const payload: TokenPayload = { _id };

  const options: SignOptions = { 
    expiresIn: JWT_EXPIRE as unknown as any 
  };

  return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyToken = (token: string): JwtPayload | string => {
  return jwt.verify(token, JWT_SECRET);
};
