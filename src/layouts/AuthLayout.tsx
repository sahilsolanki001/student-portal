import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap } from 'lucide-react';

const AuthLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
          <p className="mt-4 text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Redirect to appropriate dashboard if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left side - Image or Gradient */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-r from-blue-600 to-blue-800 items-center justify-center">
        <div className="max-w-md text-center">
          <GraduationCap size={80} className="text-white mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-6">Student Portal</h1>
          <p className="text-blue-100 text-xl">
            Manage your academic documents and profile in one secure place.
          </p>
        </div>
      </div>
      
      {/* Right side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-10 lg:hidden">
            <GraduationCap size={60} className="text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900">Student Portal</h1>
            <p className="text-gray-600 mt-2">
              Manage your academic documents and profile
            </p>
          </div>
          
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;