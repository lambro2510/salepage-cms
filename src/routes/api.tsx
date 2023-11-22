import { API_URL } from '../utils';

export const apiRoutes = {
  login: `${API_URL}/account/sign-in`,

  logout: `${API_URL}/logout`,

  users: `${API_URL}/users`,

  reviews: `${API_URL}/unknown`,

  orderHistories: `${API_URL}/seller/product-transaction`,

  products: `${API_URL}/seller/product`,

  product_detail: `${API_URL}/seller/product-detail`,

  stores: `${API_URL}/seller/store`,

  statistic: `${API_URL}/seller/statistic`,

  combos: `${API_URL}/seller/product-combo`,

  categories: `${API_URL}/seller/product-category`,

  maps : `${API_URL}/public/map`,

  productTypes : `${API_URL}/public/product/type`,
};
