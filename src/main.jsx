/**
 * React应用入口文件
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import App from './App';
import GiftList from './pages/GiftList';
import GiftDetail from './pages/GiftDetail';
import AdminGiftList from './pages/admin/GiftList';
import GiftEditor from './pages/admin/GiftEditor';
import Login from './pages/admin/Login';
import './styles/main.css';

// 权限控制组件
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <GiftList />
      },
      {
        path: 'gifts',
        element: <GiftList />
      },
      {
        path: 'gifts/:id',
        element: <GiftDetail />
      },
      {
        path: 'admin',
        children: [
          {
            path: 'login',
            element: <Login />
          },
          {
            path: 'gifts',
            element: (
              <ProtectedRoute>
                <AdminGiftList />
              </ProtectedRoute>
            )
          },
          {
            path: 'gifts/new',
            element: (
              <ProtectedRoute>
                <GiftEditor />
              </ProtectedRoute>
            )
          },
          {
            path: 'gifts/:id',
            element: (
              <ProtectedRoute>
                <GiftEditor />
              </ProtectedRoute>
            )
          }
        ]
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
); 