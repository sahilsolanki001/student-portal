import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  // Demo credentials
  const demoCredentials = [
    { role: 'Admin', email: 'admin@example.com', password: 'password' },
    { role: 'Staff', email: 'staff@example.com', password: 'password' },
    { role: 'Student', email: 'student@example.com', password: 'password' }
  ];

  const setDemoCredentials = (email: string) => {
    setEmail(email);
    setPassword('password');
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login to Student Portal</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          fullWidth
        />

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
          fullWidth
        />

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <label htmlFor="remember-me" className="ml-2 text-sm text-gray-600">
              Remember me
            </label>
          </div>
          <a href="#" className="text-sm text-blue-600 hover:underline">
            Forgot password?
          </a>
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isLoading}
        >
          Login
        </Button>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </form>

      <div className="mt-8">
        <p className="text-sm text-gray-600 mb-2 text-center">Demo Credentials:</p>
        <div className="flex flex-col space-y-2">
          {demoCredentials.map((cred) => (
            <button
              key={cred.role}
              onClick={() => setDemoCredentials(cred.email)}
              className="text-xs bg-gray-100 py-1 px-2 rounded hover:bg-gray-200 transition-colors"
            >
              <span className="font-medium">{cred.role}:</span> {cred.email} / password
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;