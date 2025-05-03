import React from 'react';
import { Menu, Bell, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  return (
    <header className="bg-white shadow-sm h-16 flex items-center justify-between px-4 sticky top-0 z-10">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar} 
          className="p-2 mr-2 text-gray-600 rounded-md hover:bg-gray-100 lg:hidden"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-semibold text-gray-800">Student Portal</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="p-2 text-gray-600 rounded-full hover:bg-gray-100 relative">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="flex items-center">
          {user.avatar ? (
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="h-8 w-8 rounded-full object-cover mr-2"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white mr-2">
              <User size={16} />
            </div>
          )}
          
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-800">{user.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;