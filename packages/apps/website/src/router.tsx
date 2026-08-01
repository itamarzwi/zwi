import { createBrowserRouter } from 'react-router-dom';

import Home from './features/Home';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/minesweeper',
    lazy: () => import('./features/Minesweeper'),
  },
]);
