import prisma from '../../../../core/config/prisma';

import User from '../types/user';
export const createUser = async (user: User) => {
  return await prisma.user.create({
    data: {
      email: user.email,
      name: user.username,
      passwordHash: user.password,
    },
  });
};

export const userById = async (userId: number) => {
  return await prisma.user.findUnique({
    where: {
      id: userId,
    },
    omit: {
      passwordHash: true,
      refreshToken: true,
    },
  });
};
export const userByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
};
export const updateUserById = async (userId: number, user: Partial<User>) => {
  return await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      ...user,
    },
  });
};

export const deleteUserById = async (userId: number) => {
  return await prisma.user.delete({
    where: {
      id: userId,
    },
  });
};
