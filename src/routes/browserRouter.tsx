import { createBrowserRouter } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import ErrorPage from '../components/errorPage';
import Layout from '../components/layout';
import Redirect from '../components/layout/Redirect';
import NotFoundPage from '../components/notfoundPage';
import { webRoutes } from './web';
import loadable from '@loadable/component';
import ProgressBar from '../components/loader/progressBar';
import RequireAuth from './requireAuth';
import Login from '../components/auth/Login';
import About from '../components/demo-pages/about';

const errorElement = <ErrorPage />;
const fallbackElement = <ProgressBar />;

const Dashboard = loadable(() => import('../components/dashboard'), {
  fallback: fallbackElement,
});
const Order = loadable(() => import('../components/orders'), {
  fallback: fallbackElement,
});

const Products = loadable(() => import('../components/products'), {
  fallback: fallbackElement,
});
const ViewProduct = loadable(() => import('../components/products/ViewCard'), {
  fallback: fallbackElement,
});
const ViewDetailProduct = loadable(() => import('../components/products/ViewDetailCard'), {
  fallback: fallbackElement,
});
const CreateProduct = loadable(() => import('../components/products/CreateCard'), {
  fallback: fallbackElement,
});
const UpdateProduct = loadable(() => import('../components/products/UpdateCard'), {
  fallback: fallbackElement,
});

const Stores = loadable(() => import('../components/stores'), {
  fallback: fallbackElement,
});
const ViewStores = loadable(() => import('../components/stores/ViewCard'), {
  fallback: fallbackElement,
});
const CreateStore = loadable(() => import('../components/stores/CreateCard'), {
  fallback: fallbackElement,
});
const UpdateStore = loadable(() => import('../components/stores/UpdateCard'), {
  fallback: fallbackElement,
});

const Categories = loadable(() => import('../components/categories'), {
  fallback: fallbackElement,
});
const CreateCategory = loadable(() => import('../components/categories/CreateCard'), {
  fallback: fallbackElement,
});
const UpdateCategory = loadable(() => import('../components/categories/UpdateCard'), {
  fallback: fallbackElement,
});
const ViewCategory = loadable(() => import('../components/categories/ViewCard'), {
  fallback: fallbackElement,
});
const Combo = loadable(() => import('../components/stores/combo'), {
  fallback: fallbackElement,
});

const ViewCombo = loadable(() => import('../components/stores/combo/ViewCard'), {
  fallback: fallbackElement,
});

const Voucher = loadable(() => import('../components/voucher'), {
  fallback: fallbackElement,
});

const ViewVoucher = loadable(() => import('../components/voucher/ViewCard'), {
  fallback: fallbackElement,
});
export const browserRouter = createBrowserRouter([
  {
    path: webRoutes.home,
    element: <Redirect />,
    errorElement: errorElement,
  },

  // auth routes
  {
    element: <AuthLayout />,
    errorElement: errorElement,
    children: [
      {
        path: webRoutes.login,
        element: <Login />,
      },
    ],
  },

  // protected routes
  {
    element: (
      <RequireAuth>
        <Layout />
      </RequireAuth>
    ),
    errorElement: errorElement,
    children: [
      {
        path: webRoutes.dashboard,
        element: <Dashboard />,
      },
      {
        path: webRoutes.products,
        element: <Products />,
        children: [
          {
            path: `${webRoutes.products}`,
            element: <ViewProduct />
          },
          {
            path: `${webRoutes.products}/detail/:id`,
            element: <ViewDetailProduct />
          },
          {
            path: `${webRoutes.products}/:id`,
            element: <UpdateProduct />
          },
          {
            path: `${webRoutes.products}/create`,
            element: <CreateProduct />
          }
        ]
      },
      {
        path: webRoutes.stores,
        element: <Stores />,
        children: [
          {
            path: `${webRoutes.stores}/create`,
            element: <CreateStore />,
            errorElement: errorElement
          },
          {
            path: `${webRoutes.stores}`,
            element: <ViewStores />,
            errorElement: errorElement
          },
          {
            path: `${webRoutes.stores}/:id`,
            element: <UpdateStore />,
            errorElement: errorElement
          }
        ]
      },
      {
        path: `${webRoutes.product_combo}`,
        element: <Combo />,
        errorElement: errorElement,
        children: [
          {
            path: `${webRoutes.product_combo}/:storeId`,
            element: <ViewCombo />,
            errorElement: errorElement
          }
        ]
      },

      {
        path: `${webRoutes.vouchers}`,
        element: <Voucher />,
        errorElement: errorElement,
        children: [
          {
            path: `${webRoutes.vouchers}`,
            element: <ViewVoucher />,
            errorElement: errorElement
          }
        ]
      },

      {
        path: webRoutes.categories,
        element: <Categories />,
        children: [
          {
            path: `${webRoutes.categories}/create`,
            element: <CreateCategory />,
            errorElement: errorElement
          },
          {
            path: `${webRoutes.categories}`,
            element: <ViewCategory />,
            errorElement: errorElement
          },
          {
            path: `${webRoutes.categories}/:id`,
            element: <UpdateCategory />,
            errorElement: errorElement
          }
        ]
      },
      {
        path: webRoutes.orders,
        element: <Order />,
      },
      {
        path: webRoutes.about,
        element: <About />,
      },
    ],
  },

  // 404
  {
    path: '*',
    element: <NotFoundPage />,
    errorElement: errorElement,
  },
]);
