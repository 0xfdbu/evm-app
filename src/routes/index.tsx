import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from '../layout/Layout';
import Home from '../pages/Home';
// import other pages here as needed

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      // more child routes here
    ]
  }
]);

export const AppRouterProvider = () => {
  return <RouterProvider router={router} />;
};
