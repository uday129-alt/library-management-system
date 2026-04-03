import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute, AppLayout } from './components/PrivateRoute';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import BooksPage from './pages/BooksPage';
import AdminBooksPage from './pages/AdminBooksPage';
import MyTransactionsPage from './pages/MyTransactionsPage';
import AdminTransactionsPage from './pages/AdminTransactionsPage';
import AdminOverduePage from './pages/AdminOverduePage';
import './styles/global.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<AuthPage />} />

          {/* Protected routes wrapped in layout */}
          <Route path="/dashboard" element={
            <PrivateRoute><AppLayout><Dashboard /></AppLayout></PrivateRoute>
          } />
          <Route path="/books" element={
            <PrivateRoute><AppLayout><BooksPage /></AppLayout></PrivateRoute>
          } />
          <Route path="/my-transactions" element={
            <PrivateRoute><AppLayout><MyTransactionsPage /></AppLayout></PrivateRoute>
          } />

          {/* Admin-only routes */}
          <Route path="/admin/books" element={
            <PrivateRoute adminOnly><AppLayout><AdminBooksPage /></AppLayout></PrivateRoute>
          } />
          <Route path="/admin/transactions" element={
            <PrivateRoute adminOnly><AppLayout><AdminTransactionsPage /></AppLayout></PrivateRoute>
          } />
          <Route path="/admin/overdue" element={
            <PrivateRoute adminOnly><AppLayout><AdminOverduePage /></AppLayout></PrivateRoute>
          } />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
