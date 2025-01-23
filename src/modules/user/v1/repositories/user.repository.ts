import prisma from '../../../../core/config/prisma';

type User = {
  username: string;
  email: string;
  password: string;
  role: string;
};
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
