import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import StaffDashboard from './pages/staff/StaffDashboard';
import StudentDashboard from './pages/student/StudentDashboard';
import DocumentManagement from './pages/staff/DocumentManagement';
import UserManagement from './pages/admin/UserManagement';
import StudentDocuments from './pages/student/StudentDocuments';
import StudentProfile from './pages/student/StudentProfile';
import { AuthProvider, useAuth } from './context/AuthContext';
import NotFound from './pages/NotFound';

// Protected route component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();
  
  // Redirect to the appropriate dashboard based on user role
  const getHomePage = () => {
    if (!isAuthenticated) return <Navigate to="/login" />;
    
    switch (user.role) {
      case 'admin':
        return <Navigate to="/admin/dashboard" />;
      case 'staff':
        return <Navigate to="/staff/dashboard" />;
      case 'student':
        return <Navigate to="/student/dashboard" />;
      default:
        return <Navigate to="/login" />;
    }
  };

  return (
    <Routes>
      {/* Auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
      
      {/* Main application routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={getHomePage()} />
        
        {/* Admin routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <UserManagement />
          </ProtectedRoute>
        } />
        
        {/* Staff routes */}
        <Route path="/staff/dashboard" element={
          <ProtectedRoute allowedRoles={['admin', 'staff']}>
            <StaffDashboard />
          </ProtectedRoute>
        } />
        <Route path="/staff/documents/:type" element={
          <ProtectedRoute allowedRoles={['admin', 'staff']}>
            <DocumentManagement />
          </ProtectedRoute>
        } />
        
        {/* Student routes */}
        <Route path="/student/dashboard" element={
          <ProtectedRoute allowedRoles={['admin', 'student']}>
            <StudentDashboard />
          </ProtectedRoute>
        } />
        <Route path="/student/documents/:type" element={
          <ProtectedRoute allowedRoles={['admin', 'student']}>
            <StudentDocuments />
          </ProtectedRoute>
        } />
        <Route path="/student/profile" element={
          <ProtectedRoute allowedRoles={['admin', 'student']}>
            <StudentProfile />
          </ProtectedRoute>
        } />
      </Route>
      
      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;