import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from '../layout/Layout';
import Home from '../pages/Home';
import CreatePost from '../pages/CreatePost';
import ViewPost from '../pages/ViewPost';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'create', element: <CreatePost /> },
      { path: 'post/:id', element: <ViewPost /> }, // ✅ new route
    ],
  },
]);

export const AppRouterProvider = () => {
  return <RouterProvider router={router} />;
};
