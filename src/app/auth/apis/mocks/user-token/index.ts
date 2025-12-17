import { loginHandler } from './login';
import { logoutHandler } from './logout';

export const userTokenHandlers = [loginHandler, logoutHandler];
