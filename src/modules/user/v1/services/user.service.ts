import * as userRepository from '../repositories/user.repository';

type User = {
  username: string;
  email: string;
  password: string;
  role: string;
};
export const createNewUser = async (user: User) => {
  //aditional buisness logic
  return await userRepository.createUser(user);
};

export const getUserByIdService = async (userId: number) => {
  if (typeof userId !== 'number' || userId <= 0) {
    throw new Error('Invalid user id');
  }

  const user = await userRepository.userById(userId);

  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

export const updateUserService = async (userId: number, user: User) => {
  if (typeof userId !== 'number' || userId <= 0) {
    throw new Error('Invalid user id');
  }

  const updatedUser = await userRepository.updateUserById(userId, user);

  if (!updatedUser) {
    throw new Error('User not found');
  }
  return updatedUser;
};

export const deleteUserService = async (userId: number) => {
  if (typeof userId !== 'number' || userId <= 0) {
    throw new Error('Invalid user id');
  }

  const deletedUser = await userRepository.deleteUserById(userId);

  if (!deletedUser) {
    throw new Error('User not found');
  }
  return deletedUser;
};
