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

const errorElement = <ErrorPage />;
const fallbackElement = <ProgressBar />;

const Home = loadable(() => import('../components/home'), {
  fallback: fallbackElement,
});
const Profile = loadable(() => import('../components/profile'), {
  fallback: fallbackElement,
});
const ProfileCard = loadable(() => import('../components/profile/profile-card'), {
  fallback: fallbackElement,
});
const OrderCard = loadable(() => import('../components/profile/order-card'), {
  fallback: fallbackElement,
});
export const browserRouter = createBrowserRouter([
  {
    path: webRoutes.home,
    element: <Layout />,
    errorElement: errorElement,
    children: [
      {
        path: webRoutes.home,
        element: <Home />,
        errorElement: errorElement,
      }
    ]
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
        path: webRoutes.profile,
        element: <Profile />,
        errorElement: errorElement,
        children: [
          {
            path: `${webRoutes.profile}/:id`,
            element: <ProfileCard />,
            errorElement: errorElement,

          },
          {
            path: `${webRoutes.profile}/order`,
            element: <OrderCard />,
            errorElement: errorElement,
          },
        ]
      }
    ],
  },

  // 404
  {
    path: '*',
    element: <NotFoundPage />,
    errorElement: errorElement,
  },
]);
