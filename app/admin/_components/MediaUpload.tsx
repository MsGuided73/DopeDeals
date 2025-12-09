'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { createClientSupabaseClient } from '../../../lib/supabase-client-factory';

interface MediaUploadProps {
  onMediaUploaded: (urls: string[]) => void;
  existingUrls?: string[];
  maxFiles?: number;
  bucket?: string;
  folder?: string;
  acceptedTypes?: string;
  label?: string;
  description?: string;
}

interface UploadState {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  url?: string;
  error?: string;
}

export default function MediaUpload({
  onMediaUploaded,
  existingUrls = [],
  maxFiles = 15, // Support up to 15 images (1 primary + 14 gallery)
  bucket = 'website-images',
  folder = 'products',
  acceptedTypes = 'image/*',
  label = 'Upload Media',
  description = 'Upload product images. First image will be the primary image.'
}: MediaUploadProps) {
  const [uploads, setUploads] = useState<UploadState[]>([]);
  const [currentUrls, setCurrentUrls] = useState<string[]>(existingUrls);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabaseBrowser = createClientSupabaseClient();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const totalFiles = currentUrls.length + uploads.length + files.length;
    if (totalFiles > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed. You selected ${files.length} but already have ${currentUrls.length + uploads.length} files.`);
      return;
    }

    // Validate file types
    const invalidFiles = files.filter(file => !file.type.startsWith('image/'));
    if (invalidFiles.length > 0) {
      alert('Only image files are allowed');
      return;
    }

    // Validate file sizes (max 10MB per file)
    const oversizedFiles = files.filter(file => file.size > 10 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      alert('Files must be smaller than 10MB');
      return;
    }

    const newUploads: UploadState[] = files.map(file => ({
      file,
      progress: 0,
      status: 'pending'
    }));

    setUploads(prev => [...prev, ...newUploads]);

    // Start uploading files
    newUploads.forEach(uploadFile);
  };

  const uploadFile = async (uploadState: UploadState) => {
    const { file } = uploadState;

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop();
    const fileName = `${timestamp}_${randomString}.${fileExtension}`;
    const filePath = `${folder}/${fileName}`;

    try {
      // Update status to uploading
      setUploads(prev => prev.map(u =>
        u.file === file ? { ...u, status: 'uploading', progress: 0 } : u
      ));

      // Upload to Supabase Storage
      const { data, error } = await supabaseBrowser.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabaseBrowser.storage
        .from(bucket)
        .getPublicUrl(filePath);

      if (!urlData.publicUrl) throw new Error('Failed to get public URL');

      // Update state with completed upload
      setUploads(prev => prev.map(u =>
        u.file === file ? {
          ...u,
          status: 'completed',
          progress: 100,
          url: urlData.publicUrl
        } : u
      ));

      // Add to current URLs
      const newUrls = [...currentUrls, urlData.publicUrl];
      setCurrentUrls(newUrls);
      onMediaUploaded(newUrls);

    } catch (error: any) {
      console.error('Upload error:', error);

      // Update state with error
      setUploads(prev => prev.map(u =>
        u.file === file ? {
          ...u,
          status: 'error',
          error: error.message || 'Upload failed'
        } : u
      ));
    }
  };

  const removeMedia = (index: number, isExisting: boolean) => {
    if (isExisting) {
      // Remove from existing URLs
      const newUrls = currentUrls.filter((_, i) => i !== index);
      setCurrentUrls(newUrls);
      onMediaUploaded(newUrls);
    } else {
      // Remove from uploads (adjust index for existing URLs)
      const uploadIndex = index - currentUrls.length;
      setUploads(prev => prev.filter((_, i) => i !== uploadIndex));
    }
  };

  const retryUpload = (uploadState: UploadState) => {
    setUploads(prev => prev.map(u =>
      u.file === uploadState.file ? { ...u, status: 'pending', error: undefined } : u
    ));
    uploadFile(uploadState);
  };

  const allMedia = [
    ...currentUrls.map(url => ({ type: 'existing' as const, url })),
    ...uploads.map(upload => ({
      type: 'upload' as const,
      upload
    }))
  ];

  const canAddMore = allMedia.length < maxFiles;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        {description && (
          <p className="text-xs text-gray-500 mb-3">{description}</p>
        )}
      </div>

      {/* Upload Area */}
      {canAddMore && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-dope-orange hover:bg-orange-50 transition-colors"
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-sm font-medium text-gray-700 mb-1">
            Click to upload images
          </p>
          <p className="text-xs text-gray-500">
            PNG, JPG, GIF up to 10MB each ({allMedia.length}/{maxFiles} used)
          </p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Media Grid */}
      {allMedia.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {allMedia.map((media, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                {media.type === 'existing' ? (
                  <Image
                    src={media.url}
                    alt={`Media ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <>
                    {media.upload.status === 'completed' && media.upload.url ? (
                      <Image
                        src={media.upload.url}
                        alt={media.upload.file.name}
                        fill
                        className="object-cover"
                      />
                    ) : media.upload.status === 'uploading' ? (
                      <div className="flex flex-col items-center justify-center h-full">
                        <Loader2 className="h-8 w-8 animate-spin text-dope-orange mb-2" />
                        <div className="w-full bg-gray-200 rounded-full h-2 mx-4">
                          <div
                            className="bg-dope-orange h-2 rounded-full transition-all duration-300"
                            style={{ width: `${media.upload.progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          {media.upload.progress}%
                        </p>
                      </div>
                    ) : media.upload.status === 'error' ? (
                      <div className="flex flex-col items-center justify-center h-full text-red-500">
                        <AlertCircle className="h-8 w-8 mb-2" />
                        <p className="text-xs text-center px-2">
                          {media.upload.error || 'Upload failed'}
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            retryUpload(media.upload);
                          }}
                          className="mt-2 px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                        >
                          Retry
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full">
                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-xs text-gray-600">
                          {media.upload.file.name}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Remove button */}
              <button
                onClick={() => removeMedia(index, media.type === 'existing')}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove media"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Status indicators */}
              {media.type === 'upload' && media.upload.status === 'completed' && (
                <div className="absolute bottom-2 left-2 bg-green-500 text-white rounded-full p-1">
                  <CheckCircle className="h-4 w-4" />
                </div>
              )}

              {/* Primary image indicator */}
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-dope-orange text-white text-xs px-2 py-1 rounded">
                  Primary
                </div>
              )}

              {/* Gallery position */}
              {index > 0 && (
                <div className="absolute bottom-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                  {index}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Instructions */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>• First uploaded image becomes the primary product image</p>
        <p>• Additional images are stored as gallery images</p>
        <p>• Images are uploaded to Supabase Storage with public URLs</p>
        <p>• Supported formats: PNG, JPG, GIF, WebP</p>
      </div>
    </div>
  );
}
