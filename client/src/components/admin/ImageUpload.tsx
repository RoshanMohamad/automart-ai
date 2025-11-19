import { useState, useRef } from 'react';
import type { DragEvent, ChangeEvent } from 'react';

export interface UploadedImage {
  id: string;
  url: string;
  name: string;
  size: number;
  uploadedAt: Date;
}

interface ImageUploadProps {
  onUploadComplete?: (images: UploadedImage[]) => void;
  maxFileSize?: number;
  allowedTypes?: string[];
}

export default function ImageUpload({ 
  onUploadComplete,
  maxFileSize = 5 * 1024 * 1024, // 5MB default
  allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
}: ImageUploadProps) {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!allowedTypes.includes(file.type)) {
      return 'Only image files (JPEG, PNG, GIF, WebP, SVG) are allowed';
    }
    if (file.size > maxFileSize) {
      return `File size must be less than ${Math.round(maxFileSize / (1024 * 1024))}MB`;
    }
    return null;
  };

  const uploadFiles = async (files: FileList | File[]) => {
    setError('');
    setSuccessMessage('');
    const fileArray = Array.from(files);
    
    // Validate all files first
    for (const file of fileArray) {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    setIsUploading(true);

    try {
      // In production, upload to your server
      // const formData = new FormData();
      // fileArray.forEach(file => formData.append('images', file));
      // const response = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      // const data = await response.json();

      const newImages: UploadedImage[] = await Promise.all(
        fileArray.map(async (file) => {
          const url = URL.createObjectURL(file);
          await new Promise(resolve => setTimeout(resolve, 500)); // Simulate upload
          
          return {
            id: `${Date.now()}-${Math.random()}`,
            url,
            name: file.name,
            size: file.size,
            uploadedAt: new Date(),
          };
        })
      );

      const updatedImages = [...images, ...newImages];
      setImages(updatedImages);
      setSuccessMessage(`Successfully uploaded ${fileArray.length} image(s)`);
      
      if (onUploadComplete) {
        onUploadComplete(newImages);
      }

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch {
      setError('Failed to upload images. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      uploadFiles(files);
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      uploadFiles(files);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const copyToClipboard = async (url: string, imageName: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setSuccessMessage(`URL copied to clipboard for ${imageName}`);
      setTimeout(() => setSuccessMessage(''), 2000);
    } catch {
      setError('Failed to copy URL to clipboard');
    }
  };

  const deleteImage = (id: string) => {
    setImages(prev => {
      const image = prev.find(img => img.id === id);
      if (image) {
        URL.revokeObjectURL(image.url);
      }
      return prev.filter(img => img.id !== id);
    });
    setSuccessMessage('Image deleted successfully');
    setTimeout(() => setSuccessMessage(''), 2000);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-8">
      {/* Upload Area */}
      <div>
        <div
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleBrowseClick}
          className={`
            relative overflow-hidden rounded-2xl transition-all duration-300 cursor-pointer
            ${isDragging 
              ? 'border-4 border-cyan-400 bg-cyan-500/20 scale-[1.02]' 
              : 'border-4 border-dashed border-slate-600 bg-gradient-to-br from-slate-800/50 to-purple-900/30 hover:border-cyan-500 hover:bg-cyan-900/20'
            }
          `}
        >
          <div className="p-12 text-center">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
            />

            {isUploading ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-cyan-400 mb-4"></div>
                <p className="text-cyan-300 text-xl font-semibold">Uploading...</p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <svg
                    className={`mx-auto h-24 w-24 transition-colors duration-300 ${
                      isDragging ? 'text-cyan-400' : 'text-slate-400'
                    }`}
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <h3 className="text-2xl font-semibold text-white mb-2">
                  {isDragging ? 'Drop images here!' : '📤 Drag & Drop Images'}
                </h3>
                
                <p className="text-slate-300 mb-4">or</p>
                
                <button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                  📁 Browse Files
                </button>

                <div className="mt-6 text-sm text-slate-400">
                  <p>✅ Supported formats: JPEG, PNG, GIF, WebP, SVG</p>
                  <p>✅ Maximum file size: {Math.round(maxFileSize / (1024 * 1024))}MB per image</p>
                </div>
              </>
            )}
          </div>

          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 pointer-events-none"></div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mt-4 bg-red-500/20 border-2 border-red-500 rounded-lg p-4 text-red-200 flex items-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            ⚠️ {error}
          </div>
        )}

        {successMessage && (
          <div className="mt-4 bg-green-500/20 border-2 border-green-500 rounded-lg p-4 text-green-200 flex items-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            ✅ {successMessage}
          </div>
        )}
      </div>

      {/* Image Gallery */}
      {images.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            📷 Uploaded Images 
            <span className="text-sm bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full">
              {images.length}
            </span>
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image) => (
              <div
                key={image.id}
                className="group relative bg-slate-800/50 backdrop-blur-sm rounded-xl overflow-hidden border-2 border-slate-700 hover:border-cyan-500 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-500/20"
              >
                {/* Image Preview */}
                <div className="aspect-video overflow-hidden bg-slate-900">
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>

                {/* Image Info */}
                <div className="p-4">
                  <h3 className="text-white font-semibold truncate mb-1" title={image.name}>
                    {image.name}
                  </h3>
                  <p className="text-slate-400 text-sm mb-3">
                    {formatFileSize(image.size)}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyToClipboard(image.url, image.name)}
                      className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 text-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy URL
                    </button>
                    
                    <button
                      onClick={() => deleteImage(image.id)}
                      className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center text-sm"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {images.length === 0 && !isUploading && (
        <div className="text-center py-12 bg-slate-800/30 rounded-xl border-2 border-slate-700/50">
          <p className="text-slate-400 text-lg">
            No images uploaded yet. Start by uploading your first image! 🚀
          </p>
        </div>
      )}
    </div>
  );
}
