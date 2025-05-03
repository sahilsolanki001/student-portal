import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Users, FileText, Award, BookOpen, Image, 
  BarChart2, Settings, LogOut, ChevronDown, ChevronRight 
} from 'lucide-react';

interface SidebarLink {
  name: string;
  to: string;
  icon: React.ReactNode;
}

interface SidebarSection {
  title: string;
  links: SidebarLink[];
  allowedRoles: string[];
}

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  if (!user) return null;

  const toggleSection = (title: string) => {
    setCollapsed({
      ...collapsed,
      [title]: !collapsed[title]
    });
  };

  const adminLinks: SidebarSection[] = [
    {
      title: 'Admin',
      allowedRoles: ['admin'],
      links: [
        { name: 'Dashboard', to: '/admin/dashboard', icon: <BarChart2 size={18} /> },
        { name: 'User Management', to: '/admin/users', icon: <Users size={18} /> },
      ]
    },
    {
      title: 'Staff Portal',
      allowedRoles: ['admin', 'staff'],
      links: [
        { name: 'Staff Dashboard', to: '/staff/dashboard', icon: <BarChart2 size={18} /> },
        { name: 'CVs', to: '/staff/documents/cv', icon: <FileText size={18} /> },
        { name: 'SOPs', to: '/staff/documents/sop', icon: <BookOpen size={18} /> },
        { name: 'RIs', to: '/staff/documents/ri', icon: <Award size={18} /> },
        { name: 'Marksheets', to: '/staff/documents/marksheet', icon: <FileText size={18} /> }
      ]
    },
    {
      title: 'Student Portal',
      allowedRoles: ['admin', 'student'],
      links: [
        { name: 'Student Dashboard', to: '/student/dashboard', icon: <BarChart2 size={18} /> },
        { name: 'My CV', to: '/student/documents/cv', icon: <FileText size={18} /> },
        { name: 'My SOP', to: '/student/documents/sop', icon: <BookOpen size={18} /> },
        { name: 'My RI', to: '/student/documents/ri', icon: <Award size={18} /> },
        { name: 'My Marksheets', to: '/student/documents/marksheet', icon: <FileText size={18} /> },
        { name: 'My Profile', to: '/student/profile', icon: <Image size={18} /> }
      ]
    },
    {
      title: 'Settings',
      allowedRoles: ['admin', 'staff', 'student'],
      links: [
        { name: 'Account Settings', to: '/settings', icon: <Settings size={18} /> }
      ]
    }
  ];

  // Filter sections based on user role
  const filteredSections = adminLinks.filter(
    section => section.allowedRoles.includes(user.role)
  );

  return (
    <div className="w-64 h-full bg-gray-800 text-white flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold">Student Portal</h1>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        {filteredSections.map((section) => (
          <div key={section.title} className="mb-4">
            <button
              onClick={() => toggleSection(section.title)}
              className="flex items-center justify-between w-full px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
            >
              <span className="font-medium">{section.title}</span>
              {collapsed[section.title] ? (
                <ChevronRight size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </button>

            {!collapsed[section.title] && (
              <div className="mt-1">
                {section.links.map((link) => {
                  const isActive = location.pathname === link.to;
                  return (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      className={`flex items-center px-6 py-2 text-sm ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      } transition-colors duration-200`}
                    >
                      <span className="mr-3">{link.icon}</span>
                      {link.name}
                    </NavLink>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-700">
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded transition-colors duration-200"
        >
          <LogOut size={18} className="mr-3" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;