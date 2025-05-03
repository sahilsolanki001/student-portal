import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, BookOpen, Award, CheckCircle, XCircle, Clock } from 'lucide-react';
import Card from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import { Document } from '../../components/ui/DocumentCard';
import { getDocumentsByType } from '../../services/documentService';

interface DocumentStat {
  type: string;
  icon: React.ReactNode;
  title: string;
  path: string;
  color: string;
  count: number;
}

const StaffDashboard: React.FC = () => {
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
        
        setDocuments([...cvDocs, ...sopDocs, ...riDocs, ...marksheetDocs]);
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAllDocuments();
  }, []);
  
  // Calculate stats
  const totalDocuments = documents.length;
  const pendingDocuments = documents.filter(doc => doc.status === 'pending').length;
  const approvedDocuments = documents.filter(doc => doc.status === 'approved').length;
  const rejectedDocuments = documents.filter(doc => doc.status === 'rejected').length;
  
  // Document type stats
  const documentTypes: DocumentStat[] = [
    {
      type: 'cv',
      icon: <FileText size={24} className="text-blue-500" />,
      title: 'CVs',
      path: '/staff/documents/cv',
      color: 'bg-blue-50 text-blue-700',
      count: documents.filter(doc => doc.type === 'cv').length
    },
    {
      type: 'sop',
      icon: <BookOpen size={24} className="text-green-500" />,
      title: 'SOPs',
      path: '/staff/documents/sop',
      color: 'bg-green-50 text-green-700',
      count: documents.filter(doc => doc.type === 'sop').length
    },
    {
      type: 'ri',
      icon: <Award size={24} className="text-yellow-500" />,
      title: 'RIs',
      path: '/staff/documents/ri',
      color: 'bg-yellow-50 text-yellow-700',
      count: documents.filter(doc => doc.type === 'ri').length
    },
    {
      type: 'marksheet',
      icon: <FileText size={24} className="text-purple-500" />,
      title: 'Marksheets',
      path: '/staff/documents/marksheet',
      color: 'bg-purple-50 text-purple-700',
      count: documents.filter(doc => doc.type === 'marksheet').length
    }
  ];
  
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
        <h1 className="text-2xl font-bold text-gray-800">Staff Dashboard</h1>
        <p className="text-sm text-gray-600">Welcome back, {user?.name}</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-blue-100">Total Documents</p>
              <h2 className="text-3xl font-bold">{totalDocuments}</h2>
            </div>
            <FileText size={40} className="text-blue-200 opacity-70" />
          </div>
        </Card>
        
        <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-yellow-100">Pending</p>
              <h2 className="text-3xl font-bold">{pendingDocuments}</h2>
            </div>
            <Clock size={40} className="text-yellow-200 opacity-70" />
          </div>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-green-100">Approved</p>
              <h2 className="text-3xl font-bold">{approvedDocuments}</h2>
            </div>
            <CheckCircle size={40} className="text-green-200 opacity-70" />
          </div>
        </Card>
        
        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-red-100">Rejected</p>
              <h2 className="text-3xl font-bold">{rejectedDocuments}</h2>
            </div>
            <XCircle size={40} className="text-red-200 opacity-70" />
          </div>
        </Card>
      </div>
      
      {/* Document Type Cards */}
      <h2 className="text-xl font-semibold text-gray-800 mt-6">Document Management</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {documentTypes.map(doc => (
          <Link to={doc.path} key={doc.type}>
            <Card className="h-full transform transition-all duration-200 hover:scale-105 hover:shadow-lg cursor-pointer">
              <div className="flex flex-col items-center text-center">
                <div className={`p-3 rounded-full ${doc.color} mb-3`}>
                  {doc.icon}
                </div>
                <h3 className="font-medium text-gray-800">{doc.title}</h3>
                <p className="text-2xl font-bold mt-1">{doc.count}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
      
      {/* Recent Documents */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recently Submitted Documents</h2>
        {documents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {documents.slice(0, 5).map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="mr-2">
                          {doc.type === 'cv' && <FileText size={16} className="text-blue-500" />}
                          {doc.type === 'sop' && <BookOpen size={16} className="text-green-500" />}
                          {doc.type === 'ri' && <Award size={16} className="text-yellow-500" />}
                          {doc.type === 'marksheet' && <FileText size={16} className="text-purple-500" />}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{doc.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {doc.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {doc.uploadedBy}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {doc.uploadDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        doc.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        doc.status === 'approved' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {doc.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 italic">No recent documents</p>
        )}
      </div>
    </div>
  );
};

export default StaffDashboard;