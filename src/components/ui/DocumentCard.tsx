import React from 'react';
import { FileText, Edit2, Trash2, Eye, Upload } from 'lucide-react';
import Button from './Button';

export type DocumentType = 'cv' | 'sop' | 'ri' | 'marksheet' | 'photo';

export interface Document {
  id: string;
  type: DocumentType;
  name: string;
  uploadedBy: string;
  uploadDate: string;
  fileUrl: string;
  status?: 'pending' | 'approved' | 'rejected';
}

interface DocumentCardProps {
  document: Document;
  role: 'admin' | 'staff' | 'student';
  onView?: (doc: Document) => void;
  onEdit?: (doc: Document) => void;
  onDelete?: (doc: Document) => void;
  onUpload?: (type: DocumentType) => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  role,
  onView,
  onEdit,
  onDelete,
  onUpload,
}) => {
  const isStaffOrAdmin = role === 'staff' || role === 'admin';
  
  const getStatusBadge = () => {
    if (!document.status) return null;
    
    const statusStyles = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${statusStyles[document.status]}`}>
        {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
      </span>
    );
  };
  
  const getDocumentTypeLabel = () => {
    const labels = {
      cv: 'Curriculum Vitae',
      sop: 'Statement of Purpose',
      ri: 'Research Interest',
      marksheet: 'Marksheet',
      photo: 'Passport Photo',
    };
    
    return labels[document.type] || document.type;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      <div className="p-4 flex items-start justify-between">
        <div className="flex items-center">
          <div className="bg-blue-100 p-2 rounded-lg mr-3">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-800">{document.name}</h3>
            <p className="text-sm text-gray-500">
              {getDocumentTypeLabel()} • Uploaded {document.uploadDate}
            </p>
            <div className="mt-1">
              {getStatusBadge()}
            </div>
          </div>
        </div>
      </div>
      
      <div className="px-4 pb-4 flex flex-wrap gap-2">
        <Button 
          variant="light" 
          size="sm" 
          leftIcon={<Eye className="h-4 w-4" />}
          onClick={() => onView && onView(document)}
        >
          View
        </Button>
        
        {isStaffOrAdmin && onEdit && (
          <Button 
            variant="info" 
            size="sm" 
            leftIcon={<Edit2 className="h-4 w-4" />}
            onClick={() => onEdit(document)}
          >
            Edit
          </Button>
        )}
        
        {isStaffOrAdmin && onDelete && (
          <Button 
            variant="danger" 
            size="sm" 
            leftIcon={<Trash2 className="h-4 w-4" />}
            onClick={() => onDelete(document)}
          >
            Delete
          </Button>
        )}
        
        {role === 'student' && onUpload && !document.fileUrl && (
          <Button 
            variant="primary" 
            size="sm" 
            leftIcon={<Upload className="h-4 w-4" />}
            onClick={() => onUpload(document.type)}
          >
            Upload
          </Button>
        )}
      </div>
    </div>
  );
};

export default DocumentCard;