import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, FileText, ShieldCheck, UserPlus, Activity } from 'lucide-react';
import Card from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import { Document } from '../../components/ui/DocumentCard';
import { getDocumentsByType } from '../../services/documentService';

// Mock statistics for demonstration
const mockStats = {
  totalUsers: 35,
  activeUsers: 28,
  staffMembers: 7,
  students: 28,
  newUsersThisWeek: 5,
  documentsProcessed: 42,
  recentActivities: [
    { id: 1, action: 'Document approved', user: 'John Smith', time: '2 hours ago', type: 'success' },
    { id: 2, action: 'New user registered', user: 'Emily Johnson', time: '5 hours ago', type: 'info' },
    { id: 3, action: 'Document rejected', user: 'Michael Brown', time: '1 day ago', type: 'error' },
    { id: 4, action: 'Profile updated', user: 'Sarah Davis', time: '1 day ago', type: 'info' },
    { id: 5, action: 'Document uploaded', user: 'David Wilson', time: '2 days ago', type: 'info' }
  ]
};

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchAllDocuments = async () => {
      setIsLoading(true);
      try {
        // Fetch documents of different types
        const cvDocs = await getDocumentsByType('cv');
        const sopDocs = await getDocumentsByType('sop');
        const riDocs = await getDocumentsByType('ri');
        const marksheetDocs = await getDocumentsByType('marksheet');
        const photoDocs = await getDocumentsByType('photo');
        
        setDocuments([...cvDocs, ...sopDocs, ...riDocs, ...marksheetDocs, ...photoDocs]);
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAllDocuments();
  }, []);
  
  // Calculate document statistics
  const pendingDocuments = documents.filter(doc => doc.status === 'pending').length;
  const approvedDocuments = documents.filter(doc => doc.status === 'approved').length;
  const rejectedDocuments = documents.filter(doc => doc.status === 'rejected').length;
  
  // Display loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-1/3 bg-gray-200 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-sm text-gray-600">Welcome back, {user?.name}</p>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-blue-100">Total Users</p>
              <h2 className="text-3xl font-bold">{mockStats.totalUsers}</h2>
            </div>
            <Users size={40} className="text-blue-200 opacity-70" />
          </div>
        </Card>
        
        <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-emerald-100">Staff Members</p>
              <h2 className="text-3xl font-bold">{mockStats.staffMembers}</h2>
            </div>
            <ShieldCheck size={40} className="text-emerald-200 opacity-70" />
          </div>
        </Card>
        
        <Card className="bg-gradient-to-r from-violet-500 to-violet-600 text-white">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-violet-100">Students</p>
              <h2 className="text-3xl font-bold">{mockStats.students}</h2>
            </div>
            <UserPlus size={40} className="text-violet-200 opacity-70" />
          </div>
        </Card>
        
        <Card className="bg-gradient-to-r from-amber-500 to-amber-600 text-white">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-amber-100">New This Week</p>
              <h2 className="text-3xl font-bold">{mockStats.newUsersThisWeek}</h2>
            </div>
            <Activity size={40} className="text-amber-200 opacity-70" />
          </div>
        </Card>
      </div>
      
      {/* Document Stats */}
      <h2 className="text-xl font-semibold text-gray-800 mt-6">Document Statistics</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-3">
              <FileText size={28} className="text-blue-600" />
            </div>
            <h3 className="font-medium text-gray-800">Total Documents</h3>
            <p className="text-2xl font-bold mt-1">{documents.length}</p>
          </div>
        </Card>
        
        <Card>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-3">
              <FileText size={28} className="text-green-600" />
            </div>
            <h3 className="font-medium text-gray-800">Approved</h3>
            <p className="text-2xl font-bold mt-1">{approvedDocuments}</p>
          </div>
        </Card>
        
        <Card>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mb-3">
              <FileText size={28} className="text-yellow-600" />
            </div>
            <h3 className="font-medium text-gray-800">Pending</h3>
            <p className="text-2xl font-bold mt-1">{pendingDocuments}</p>
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* User Management Card */}
        <Card title="User Management" className="h-full">
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Users size={20} className="text-blue-600 mr-2" />
                <span className="font-medium">Total Users</span>
              </div>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                {mockStats.totalUsers}
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Users size={20} className="text-green-600 mr-2" />
                <span className="font-medium">Active Users</span>
              </div>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                {mockStats.activeUsers}
              </span>
            </div>
            
            <Link to="/admin/users" className="block p-3 bg-blue-50 text-blue-700 rounded-lg text-center font-medium hover:bg-blue-100 transition duration-200">
              Manage Users
            </Link>
          </div>
        </Card>
        
        {/* Recent Activities Card */}
        <Card title="Recent Activities" className="h-full">
          <div className="space-y-3">
            {mockStats.recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start p-3 bg-gray-50 rounded-lg">
                <div className={`
                  w-2 h-2 mt-2 rounded-full mr-3
                  ${activity.type === 'success' ? 'bg-green-500' : 
                    activity.type === 'error' ? 'bg-red-500' : 'bg-blue-500'}
                `} />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="font-medium text-gray-800">{activity.action}</p>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                  <p className="text-sm text-gray-600">by {activity.user}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;