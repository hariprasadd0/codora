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
