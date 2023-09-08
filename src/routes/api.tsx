import { API_URL } from '../utils';

export const apiRoutes = {
  login: `${API_URL}/account/sign-in`,
  logout: `${API_URL}/logout`,
  users: `${API_URL}/users`,
  reviews: `${API_URL}/unknown`,

  orderHistories: `${API_URL}/seller/product-transaction`,
};
