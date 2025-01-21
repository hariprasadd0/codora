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
