import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Eye, Edit2, Trash2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Button from '../../components/ui/Button';
import DocumentCard, { Document, DocumentType } from '../../components/ui/DocumentCard';
import { getDocumentsByType, updateDocument, deleteDocument } from '../../services/documentService';

const DocumentManagement: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

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

  const handleView = (doc: Document) => {
    setSelectedDocument(doc);
    setShowViewModal(true);
  };

  const handleEdit = (doc: Document) => {
    setSelectedDocument(doc);
    setShowEditModal(true);
  };

  const handleDelete = (doc: Document) => {
    setSelectedDocument(doc);
    setShowDeleteModal(true);
  };

  const handleUpdateStatus = async (status: 'approved' | 'rejected') => {
    if (!selectedDocument) return;

    setIsProcessing(true);
    try {
      const updatedDoc = { ...selectedDocument, status };
      await updateDocument(updatedDoc);

      // Update local state
      setDocuments(docs => 
        docs.map(doc => doc.id === selectedDocument.id ? updatedDoc : doc)
      );
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating document status:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedDocument) return;

    setIsProcessing(true);
    try {
      await deleteDocument(selectedDocument.id);

      // Update local state
      setDocuments(docs => docs.filter(doc => doc.id !== selectedDocument.id));
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting document:', error);
    } finally {
      setIsProcessing(false);
    }
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
      default:
        return 'Document';
    }
  };

  // Filter documents based on search and status
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         doc.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">{getDocumentTypeTitle()} Management</h1>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by name or student"
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute right-3 top-2.5 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-600">Status:</label>
          <select
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      ) : (
        <>
          {filteredDocuments.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredDocuments.map(doc => (
                <DocumentCard
                  key={doc.id}
                  document={doc}
                  role="staff"
                  onView={() => handleView(doc)}
                  onEdit={() => handleEdit(doc)}
                  onDelete={() => handleDelete(doc)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <AlertCircle size={48} className="mx-auto text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No Documents Found</h3>
              <p className="mt-2 text-gray-500">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : `There are no ${getDocumentTypeTitle().toLowerCase()} documents available`}
              </p>
            </div>
          )}

          {/* View Document Modal */}
          {showViewModal && selectedDocument && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">View {getDocumentTypeTitle()}</h2>
                  <button 
                    onClick={() => setShowViewModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="mb-4">
                  <h3 className="font-medium text-gray-800 mb-2">{selectedDocument.name}</h3>
                  <p className="text-sm text-gray-500">Uploaded by {selectedDocument.uploadedBy} on {selectedDocument.uploadDate}</p>
                  
                  <div className="mt-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      selectedDocument.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      selectedDocument.status === 'approved' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {selectedDocument.status}
                    </span>
                  </div>
                </div>
                
                <div className="border rounded-lg overflow-hidden">
                  {selectedDocument.type === 'photo' ? (
                    <img 
                      src={selectedDocument.fileUrl} 
                      alt={selectedDocument.name}
                      className="max-w-full h-auto mx-auto"
                    />
                  ) : (
                    <iframe
                      src={selectedDocument.fileUrl}
                      title={selectedDocument.name}
                      className="w-full h-[50vh]"
                    />
                  )}
                </div>
                
                <div className="flex justify-end mt-4 space-x-2">
                  <Button
                    variant="light"
                    onClick={() => setShowViewModal(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Document Modal */}
          {showEditModal && selectedDocument && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Update Status</h2>
                  <button 
                    onClick={() => setShowEditModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="mb-4">
                  <h3 className="font-medium text-gray-800">{selectedDocument.name}</h3>
                  <p className="text-sm text-gray-500">Current Status: {selectedDocument.status}</p>
                </div>
                
                <div className="space-y-3">
                  <Button
                    variant="success"
                    fullWidth
                    leftIcon={<CheckCircle size={18} />}
                    onClick={() => handleUpdateStatus('approved')}
                    isLoading={isProcessing}
                    disabled={isProcessing}
                  >
                    Approve Document
                  </Button>
                  <Button
                    variant="danger"
                    fullWidth
                    leftIcon={<XCircle size={18} />}
                    onClick={() => handleUpdateStatus('rejected')}
                    isLoading={isProcessing}
                    disabled={isProcessing}
                  >
                    Reject Document
                  </Button>
                </div>
                
                <div className="mt-6">
                  <Button
                    variant="light"
                    fullWidth
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Delete Document Modal */}
          {showDeleteModal && selectedDocument && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex items-center mb-4">
                  <div className="bg-red-100 p-2 rounded-full mr-3">
                    <AlertCircle size={24} className="text-red-600" />
                  </div>
                  <h2 className="text-xl font-semibold">Confirm Deletion</h2>
                </div>
                
                <p className="mb-4">
                  Are you sure you want to delete <span className="font-medium">{selectedDocument.name}</span>? This action cannot be undone.
                </p>
                
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="light"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="danger"
                    onClick={handleConfirmDelete}
                    isLoading={isProcessing}
                  >
                    Delete
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

export default DocumentManagement;