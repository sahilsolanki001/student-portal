import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, BookOpen, Award, Image } from 'lucide-react';
import Card from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import { Document, DocumentType } from '../../components/ui/DocumentCard';
import { getDocumentsByType } from '../../services/documentService';

interface DocumentStatus {
  type: DocumentType;
  status: 'not_uploaded' | 'pending' | 'approved' | 'rejected';
  icon: React.ReactNode;
  title: string;
  path: string;
}

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
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
    
    fetchDocuments();
  }, []);

  // Document status cards
  const documentStatuses: DocumentStatus[] = [
    {
      type: 'cv',
      status: documents.find(d => d.type === 'cv')?.status || 'not_uploaded',
      icon: <FileText size={24} className="text-blue-500" />,
      title: 'Curriculum Vitae',
      path: '/student/documents/cv'
    },
    {
      type: 'sop',
      status: documents.find(d => d.type === 'sop')?.status || 'not_uploaded',
      icon: <BookOpen size={24} className="text-green-500" />,
      title: 'Statement of Purpose',
      path: '/student/documents/sop'
    },
    {
      type: 'ri',
      status: documents.find(d => d.type === 'ri')?.status || 'not_uploaded',
      icon: <Award size={24} className="text-yellow-500" />,
      title: 'Research Interest',
      path: '/student/documents/ri'
    },
    {
      type: 'marksheet',
      status: documents.find(d => d.type === 'marksheet')?.status || 'not_uploaded',
      icon: <FileText size={24} className="text-purple-500" />,
      title: 'Marksheet',
      path: '/student/documents/marksheet'
    },
    {
      type: 'photo',
      status: documents.find(d => d.type === 'photo')?.status || 'not_uploaded',
      icon: <Image size={24} className="text-red-500" />,
      title: 'Passport Photo',
      path: '/student/profile'
    }
  ];

  const getStatusDetails = (status: string) => {
    switch (status) {
      case 'not_uploaded':
        return { color: 'bg-gray-100 text-gray-700', text: 'Not Uploaded' };
      case 'pending':
        return { color: 'bg-yellow-100 text-yellow-700', text: 'Pending Approval' };
      case 'approved':
        return { color: 'bg-green-100 text-green-700', text: 'Approved' };
      case 'rejected':
        return { color: 'bg-red-100 text-red-700', text: 'Rejected' };
      default:
        return { color: 'bg-gray-100 text-gray-700', text: 'Unknown' };
    }
  };

  // Display loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-1/3 bg-gray-200 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-40 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Student Dashboard</h1>
        <p className="text-sm text-gray-600">Welcome back, {user?.name}</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {documentStatuses.map((doc) => {
          const statusDetails = getStatusDetails(doc.status);
          return (
            <Link to={doc.path} key={doc.type}>
              <Card className="h-full transform transition-all duration-200 hover:scale-105 hover:shadow-lg cursor-pointer">
                <div className="flex items-start">
                  <div className="flex-shrink-0 p-3 rounded-lg bg-blue-50">
                    {doc.icon}
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium text-gray-800">{doc.title}</h3>
                    <span className={`inline-block px-2 py-1 mt-2 text-xs rounded-full ${statusDetails.color}`}>
                      {statusDetails.text}
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activities</h2>
        {documents.length > 0 ? (
          <ul className="space-y-3">
            {documents.slice(0, 5).map((doc) => (
              <li key={doc.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="mr-3">
                      {doc.type === 'cv' && <FileText size={18} className="text-blue-500" />}
                      {doc.type === 'sop' && <BookOpen size={18} className="text-green-500" />}
                      {doc.type === 'ri' && <Award size={18} className="text-yellow-500" />}
                      {doc.type === 'marksheet' && <FileText size={18} className="text-purple-500" />}
                      {doc.type === 'photo' && <Image size={18} className="text-red-500" />}
                    </span>
                    <span className="text-sm font-medium">{doc.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">{doc.uploadDate}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic">No recent activities</p>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;