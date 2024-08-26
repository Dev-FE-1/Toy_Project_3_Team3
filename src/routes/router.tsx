import { createBrowserRouter } from 'react-router-dom';
import ErrorPage from '@/pages/ErrorPage';
import Timeline from '@/pages/Timeline';
import Playlist from '@/pages/Playlist';
import Like from '@/pages/Like';
import MyPage from '@/pages/MyPage';
import Layout from '@/layout/Layout';
import Home from '@/pages/Home';
import Watch from '@/pages/Watch';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/timeline',
        element: <Timeline />,
      },
      {
        path: '/playlist',
        element: <Playlist />,
      },
      {
        path: '/like',
        element: <Like />,
      },
      {
        path: '/mypage',
        element: <MyPage />,
      },
      {
        path: '/watch',
        element: <Watch />,
      },
    ],
  },
]);
