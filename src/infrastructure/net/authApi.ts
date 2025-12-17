import axios from 'axios';

import { authPrefix } from '../variables';

export const authApi = axios.create({
  baseURL: authPrefix,
});
