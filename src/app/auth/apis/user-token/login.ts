import { User } from '../../models';

export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginResponse = User & {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};
