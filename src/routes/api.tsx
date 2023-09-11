import { API_URL } from '../utils';

export const apiRoutes = {
  login: `${API_URL}/account/sign-in`,
  logout: `${API_URL}/logout`,
  users: `${API_URL}/users`,
  reviews: `${API_URL}/unknown`,

  orderHistories: `${API_URL}/seller/product-transaction`,

  products: `${API_URL}/seller/product`,

  stores: `${API_URL}/seller/store`,

  categories: `${API_URL}/seller/product-category`,

  maps : `${API_URL}/public/map`,
};
