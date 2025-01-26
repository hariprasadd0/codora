type User = {
  id: number;
  username: string;
  email: string;
  password: string;
  googleId?: string;
  githubId?: string;
  refreshToken?: string;
};

export default User;
