import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Home } from '../pages/Home';
import { Catalog } from '../pages/Catalog';
import { ProductDetails } from '../pages/ProductDetails';
import { Cart } from '../pages/Cart';
import { Checkout } from '../pages/Checkout';
import { OrderConfirmation } from '../pages/OrderConfirmation';
import { NotFound } from '../pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'products',
        element: <Catalog />,
      },
      {
        path: 'products/:id',
        element: <ProductDetails />,
      },
      {
        path: 'cart',
        element: <Cart />,
      },
      {
        path: 'checkout',
        element: <Checkout />,
      },
      {
        path: 'order/:orderId',
        element: <OrderConfirmation />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);
