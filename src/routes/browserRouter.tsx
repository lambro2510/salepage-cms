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
const CreateProduct = loadable(() => import('../components/products/CreateCard'), {
  fallback: fallbackElement,
});
const UpdateProduct = loadable(() => import('../components/products/UpdateCard'), {
  fallback: fallbackElement,
});

const Stores = loadable(() => import('../components/stores'), {
  fallback: fallbackElement,
});
const CreateStore = loadable(() => import('../components/stores/CreateCard'), {
  fallback: fallbackElement,
});

const Categories = loadable(() => import('../components/categories'), {
  fallback: fallbackElement,
});
const CreateCategory = loadable(() => import('../components/categories/CreateCard'), {
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
            path: `${webRoutes.products}/:id`,
            element: <UpdateProduct />
          },
          {
            path: `${webRoutes.products}/create`,
            element: <CreateProduct />
          },
        ]
      },
      {
        path: webRoutes.stores,
        element: <Stores />,
        children: [
          {
            path: `${webRoutes.stores}/create`,
            element: <CreateStore />,
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
