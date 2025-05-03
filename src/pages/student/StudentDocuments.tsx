import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Upload, AlertCircle } from 'lucide-react';
import Button from '../../components/ui/Button';
import DocumentCard, { Document, DocumentType } from '../../components/ui/DocumentCard';
import { getDocumentsByType, uploadDocument } from '../../services/documentService';
import { useAuth } from '../../context/AuthContext';

const StudentDocuments: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const documentType = type as DocumentType;

  useEffect(() => {
    const fetchDocuments = async () => {
      setIsLoading(true);
      try {
        const docs = await getDocumentsByType(documentType);
        setDocuments(docs);
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (documentType) {
      fetchDocuments();
    }
  }, [documentType]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      const newDoc: Omit<Document, 'id'> = {
        type: documentType,
        name: file.name,
        uploadedBy: user?.name || 'Unknown',
        uploadDate: new Date().toISOString().split('T')[0],
        fileUrl: URL.createObjectURL(file), // In a real app, this would be a server URL
        status: 'pending'
      };

      const uploadedDoc = await uploadDocument(newDoc);
      setDocuments([...documents, uploadedDoc]);
      setShowUpload(false);
      setFile(null);
    } catch (error) {
      console.error('Error uploading document:', error);
      setError('Failed to upload document. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleView = (doc: Document) => {
    window.open(doc.fileUrl, '_blank');
  };

  const getDocumentTypeTitle = () => {
    switch (documentType) {
      case 'cv':
        return 'Curriculum Vitae';
      case 'sop':
        return 'Statement of Purpose';
      case 'ri':
        return 'Research Interest';
      case 'marksheet':
        return 'Marksheet';
      case 'photo':
        return 'Passport Photo';
      default:
        return 'Document';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">{getDocumentTypeTitle()}</h1>
        {documents.length === 0 && !isLoading && (
          <Button
            variant="primary"
            leftIcon={<Upload size={18} />}
            onClick={() => setShowUpload(true)}
          >
            Upload Document
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-40 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      ) : (
        <>
          {documents.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {documents.map(doc => (
                <DocumentCard
                  key={doc.id}
                  document={doc}
                  role="student"
                  onView={handleView}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <AlertCircle size={48} className="mx-auto text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No Documents Found</h3>
              <p className="mt-2 text-gray-500">
                You haven't uploaded any {getDocumentTypeTitle().toLowerCase()} yet.
              </p>
              <Button 
                variant="primary" 
                className="mt-4"
                leftIcon={<Upload size={18} />}
                onClick={() => setShowUpload(true)}
              >
                Upload Now
              </Button>
            </div>
          )}

          {showUpload && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Upload {getDocumentTypeTitle()}</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select File
                  </label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="light"
                    onClick={() => {
                      setShowUpload(false);
                      setFile(null);
                      setError('');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleUpload}
                    isLoading={isUploading}
                  >
                    Upload
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StudentDocuments;