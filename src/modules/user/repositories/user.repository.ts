import prisma from '../../../core/config/prisma';

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
