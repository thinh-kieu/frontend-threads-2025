import { http, HttpResponse } from 'msw';

import { authApi } from '@/infrastructure/net';

import { USER_TOKEN_ENDPOINTS } from '../../user-token/endpoints';

export const logoutHandler = http.post(
  authApi.defaults.baseURL + USER_TOKEN_ENDPOINTS.logout,
  async () => {
    return HttpResponse.json({
      message: 'Logged out successfully',
    });
  },
);
