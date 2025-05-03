import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Camera, Upload } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { getDocumentsByType, uploadDocument } from '../../services/documentService';
import { Document } from '../../components/ui/DocumentCard';

const StudentProfile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photo, setPhoto] = useState<Document | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchPhoto = async () => {
      setIsLoading(true);
      try {
        const photos = await getDocumentsByType('photo');
        if (photos.length > 0) {
          setPhoto(photos[0]);
        }
      } catch (error) {
        console.error('Error fetching photo:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPhoto();
  }, []);

  const handleSaveProfile = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      // In a real app, we would update the user profile
      setIsSaving(false);
      setIsEditing(false);
    }, 1000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setPhotoFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleUploadPhoto = async () => {
    if (!photoFile) return;

    setIsUploading(true);
    try {
      const newPhoto: Omit<Document, 'id'> = {
        type: 'photo',
        name: photoFile.name,
        uploadedBy: user?.name || 'Unknown',
        uploadDate: new Date().toISOString().split('T')[0],
        fileUrl: URL.createObjectURL(photoFile), // In a real app, this would be a server URL
        status: 'pending'
      };

      const uploadedPhoto = await uploadDocument(newPhoto);
      setPhoto(uploadedPhoto);
      setShowPhotoUpload(false);
      setPhotoFile(null);
    } catch (error) {
      console.error('Error uploading photo:', error);
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-1/3 bg-gray-200 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <div className="h-80 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="lg:col-span-2">
            <div className="h-80 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Photo Card */}
        <div className="lg:col-span-1">
          <Card title="Profile Photo" className="h-full">
            <div className="flex flex-col items-center">
              {photo ? (
                <div className="mb-4 relative">
                  <img
                    src={photo.fileUrl}
                    alt="Profile"
                    className="w-40 h-40 rounded-full object-cover border-4 border-blue-100"
                  />
                  <button
                    className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
                    onClick={() => setShowPhotoUpload(true)}
                  >
                    <Camera size={16} />
                  </button>
                </div>
              ) : (
                <div className="mb-4 bg-gray-200 w-40 h-40 rounded-full flex items-center justify-center">
                  <User size={64} className="text-gray-400" />
                </div>
              )}
              
              <div className="text-center">
                <h3 className="font-medium text-gray-800">{user?.name}</h3>
                <p className="text-gray-500 text-sm">{user?.email}</p>
                <p className="text-gray-500 text-sm mt-1 capitalize">
                  {user?.role} Account
                </p>
              </div>
              
              {!photo && (
                <Button
                  variant="primary"
                  className="mt-4"
                  leftIcon={<Upload size={16} />}
                  onClick={() => setShowPhotoUpload(true)}
                >
                  Upload Photo
                </Button>
              )}
            </div>
          </Card>
        </div>
        
        {/* Profile Details Card */}
        <div className="lg:col-span-2">
          <Card title="Personal Information" className="h-full">
            <div className="space-y-4">
              {isEditing ? (
                <>
                  <Input
                    label="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                  />
                  <Input
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled
                    fullWidth
                  />
                  <div className="flex justify-end space-x-2 mt-6">
                    <Button
                      variant="light"
                      onClick={() => {
                        setIsEditing(false);
                        setName(user?.name || '');
                        setEmail(user?.email || '');
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleSaveProfile}
                      isLoading={isSaving}
                    >
                      Save Changes
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Full Name</p>
                      <p className="mt-1">{user?.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="mt-1">{user?.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Role</p>
                      <p className="mt-1 capitalize">{user?.role}</p>
                    </div>
                  </div>
                  <div className="flex justify-end mt-6">
                    <Button
                      variant="primary"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Profile
                    </Button>
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>
      </div>
      
      {/* Upload Photo Modal */}
      {showPhotoUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Upload Profile Photo</h2>
            <div className="mb-4">
              {previewUrl && (
                <div className="mb-4 flex justify-center">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-32 h-32 rounded-full object-cover"
                  />
                </div>
              )}
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Photo
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                accept=".jpg,.jpeg,.png"
              />
              <p className="text-xs text-gray-500 mt-1">
                Accepted formats: JPG, JPEG, PNG
              </p>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="light"
                onClick={() => {
                  setShowPhotoUpload(false);
                  setPhotoFile(null);
                  setPreviewUrl(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleUploadPhoto}
                isLoading={isUploading}
                disabled={!photoFile}
              >
                Upload
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentProfile;