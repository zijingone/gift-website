/**
 * React应用入口文件
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route, Navigate } from 'react-router-dom';
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

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Navigate to="/gifts" replace />} />
      <Route path="gifts" element={<GiftList />} />
      <Route path="gifts/:id" element={<GiftDetail />} />
      <Route path="admin">
        <Route path="login" element={<Login />} />
        <Route 
          path="gifts" 
          element={
            <ProtectedRoute>
              <AdminGiftList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="gifts/new" 
          element={
            <ProtectedRoute>
              <GiftEditor />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="gifts/:id" 
          element={
            <ProtectedRoute>
              <GiftEditor />
            </ProtectedRoute>
          } 
        />
      </Route>
    </Route>
  ),
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }
  }
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
); 