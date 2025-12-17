import { http, HttpResponse } from 'msw';

import { authApi } from '@/infrastructure/net';
import {
  generateAccessToken,
  generateRefreshToken,
} from '@/infrastructure/net/mockJWT';

import { USER_TOKEN_ENDPOINTS } from '../../user-token/endpoints';
import { LoginRequest, LoginResponse } from '../../user-token/login';

export const loginHandler = http.post<any, LoginRequest, LoginResponse>(
  authApi.defaults.baseURL + USER_TOKEN_ENDPOINTS.login,
  async ({ request }) => {
    const { username } = await request.json();

    return HttpResponse.json({
      userId: 'user-123',
      username: username,
      accessToken: await generateAccessToken(),
      refreshToken: await generateRefreshToken(),
      expiresIn: 100000,
      role: 'user',
    });
  },
);
