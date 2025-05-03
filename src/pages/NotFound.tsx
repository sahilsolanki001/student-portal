import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { HomeIcon } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-9xl font-bold text-blue-600">404</h1>
      <h2 className="text-3xl font-semibold text-gray-800 mt-4">Page Not Found</h2>
      <p className="text-gray-600 mt-2 max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="mt-6">
        <Button variant="primary" leftIcon={<HomeIcon size={18} />}>
          Go to Homepage
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;