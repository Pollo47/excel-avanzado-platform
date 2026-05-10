import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminPage from './pages/AdminPage';
import ExcelCurso from './pages/ExcelCurso';
import ExcelModule from './pages/ExcelModule';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'admin', element: <AdminPage /> },
      { path: 'excel', element: <ExcelCurso /> },
      { path: 'excel/module/:moduleId', element: <ExcelModule /> },
    ],
  },
]);