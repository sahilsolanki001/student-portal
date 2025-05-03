import { Document, DocumentType } from '../components/ui/DocumentCard';

// Sample document data for demonstration
const sampleDocuments: Document[] = [
  {
    id: '1',
    type: 'cv',
    name: 'John_Smith_CV.pdf',
    uploadedBy: 'John Smith',
    uploadDate: '2025-04-15',
    fileUrl: 'https://example.com/cv.pdf',
    status: 'approved'
  },
  {
    id: '2',
    type: 'sop',
    name: 'Amanda_Jones_SOP.pdf',
    uploadedBy: 'Amanda Jones',
    uploadDate: '2025-04-10',
    fileUrl: 'https://example.com/sop.pdf',
    status: 'pending'
  },
  {
    id: '3',
    type: 'ri',
    name: 'Michael_Brown_RI.pdf',
    uploadedBy: 'Michael Brown',
    uploadDate: '2025-04-05',
    fileUrl: 'https://example.com/ri.pdf',
    status: 'rejected'
  },
  {
    id: '4',
    type: 'marksheet',
    name: 'Sarah_Davis_Marksheet.pdf',
    uploadedBy: 'Sarah Davis',
    uploadDate: '2025-03-20',
    fileUrl: 'https://example.com/marksheet.pdf',
    status: 'approved'
  },
  {
    id: '5',
    type: 'photo',
    name: 'James_Wilson_Photo.jpg',
    uploadedBy: 'James Wilson',
    uploadDate: '2025-03-15',
    fileUrl: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    status: 'approved'
  }
];

// Service functions
export const getDocumentsByType = (type: DocumentType): Promise<Document[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(sampleDocuments.filter(doc => doc.type === type));
    }, 500);
  });
};

export const getDocumentById = (id: string): Promise<Document | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(sampleDocuments.find(doc => doc.id === id));
    }, 500);
  });
};

export const uploadDocument = (document: Omit<Document, 'id'>): Promise<Document> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newDocument: Document = {
        ...document,
        id: Math.random().toString(36).substr(2, 9),
        status: 'pending'
      };
      sampleDocuments.push(newDocument);
      resolve(newDocument);
    }, 1000);
  });
};

export const updateDocument = (document: Document): Promise<Document> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = sampleDocuments.findIndex(doc => doc.id === document.id);
      if (index !== -1) {
        sampleDocuments[index] = document;
        resolve(document);
      } else {
        throw new Error('Document not found');
      }
    }, 1000);
  });
};

export const deleteDocument = (id: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = sampleDocuments.findIndex(doc => doc.id === id);
      if (index !== -1) {
        sampleDocuments.splice(index, 1);
        resolve(true);
      } else {
        resolve(false);
      }
    }, 1000);
  });
};