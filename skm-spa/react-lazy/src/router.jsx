import React from 'react';
import { Outlet, createBrowserRouter } from 'react-router-dom';
import App from './App';

const LazyComponent = React.lazy(() => import('./Lazy'));
const LazyUser = React.lazy(() => import('./User'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Outlet></Outlet>,
    children: [
      {
        index: true,
        element: <App />
      },
      {
        path: '/lazy',
        element: <React.Suspense fallback={'loading lazy route'}>
          <LazyComponent></LazyComponent>
        </React.Suspense>
      },
      {
        path: '/users/:userId',
        element: <React.Suspense fallback={'loading lazy route'}>
          <LazyUser></LazyUser>
        </React.Suspense>
      }
    ]
  }
]);