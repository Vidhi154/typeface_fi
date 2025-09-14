import React, { useState } from 'react';
import api from '../api/api';

export default function ReceiptUpload({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file first');
      return;
    }

    const formData = new FormData();
    formData.append('receipt', file);

    try {
      setUploading(true);
      const res = await api.post('/receipts/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage('Receipt uploaded successfully!');
      setFile(null);
      if (onUploaded) onUploaded(res.data.transaction); // refresh transaction list
    } catch (err) {
      console.error(err);
      setMessage('Failed to upload receipt');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 border rounded mb-6 bg-white shadow-sm">
      <h3 className="font-semibold mb-3">Upload Receipt</h3>

      <input type="file" accept="image/*,application/pdf" onChange={handleFileChange} className="mb-2" />

      <button
        onClick={handleUpload}
        disabled={uploading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>

      {message && <p className="mt-2 text-sm text-gray-700">{message}</p>}
    </div>
  );
}
