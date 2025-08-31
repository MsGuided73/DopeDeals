"use client";
import { useState, FormEvent } from 'react';

type Bucket = 'products' | 'website-images' | 'ads';

export default function ImageUploadModal({ open, onClose }: { open: boolean; onClose: () => void; }) {
  const [bucket, setBucket] = useState<Bucket>('products');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setMessage(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', bucket);
      const res = await fetch('/api/admin/upload-image', { method: 'POST', body: formData });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Upload failed');
      setMessage(`Uploaded! URL: ${json.url}`);
      setFile(null);
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setUploading(false);
    }
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold mb-4">Upload Image</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Bucket</label>
            <select value={bucket} onChange={e => setBucket(e.target.value as Bucket)} className="w-full border rounded p-2">
              <option value="products">Products</option>
              <option value="website-images">Website Images</option>
              <option value="ads">Ads</option>
            </select>
          </div>
          <div>
            <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} />
          </div>
          {message && <p className="text-sm">{message}</p>}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-3 py-2 rounded border">Cancel</button>
            <button type="submit" disabled={!file || uploading} className="px-3 py-2 rounded bg-blue-600 text-white disabled:opacity-50">
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

