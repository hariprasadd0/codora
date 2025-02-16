import jwt from 'jsonwebtoken';

export const generateAccessToken = (userId: number) => {
  return jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET!, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
};

export const generateRefreshToken = (userId: number) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
};

export const generateResetToken = (userId: number) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: process.env.RESET_TOKEN_EXPIRY,
  });
};

export const verifyResetToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
};
