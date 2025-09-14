import React, { useState, useContext } from "react";
import api from "../api/api";
import { AuthContext } from "../contexts/AuthContext";

export default function ReceiptUpload({ onUpload }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const { user } = useContext(AuthContext);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setExtractedData(null);

    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("receipt", file);

    try {
      setLoading(true);
      const res = await api.post("/receipts/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setExtractedData({
        fileName: res.data.fileName,
        date: res.data.date,
        total: res.data.total,
        rawText: res.data.rawText
      });

      if (onUpload) onUpload(res.data);

      setFile(null);
      setPreview(null);
      console.log("✅ Upload success:", res.data);
    } catch (err) {
      console.error("❌ Upload failed:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6">
      <input type="file" onChange={handleFileChange} className="mb-2" />
      <button
        onClick={handleUpload}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Uploading..." : "Upload Receipt"}
      </button>

      {preview && (
        <div className="mt-4">
          <img src={preview} alt="Receipt Preview" className="max-w-xs border rounded" />
        </div>
      )}

      {extractedData && (
        <div className="mt-4 p-3 border rounded bg-gray-50">
          <p><strong>File:</strong> {extractedData.fileName}</p>
          <p><strong>Date:</strong> {extractedData.date || "Not detected"}</p>
          <p><strong>Total:</strong> {extractedData.total != null ? `$${extractedData.total}` : "Not detected"}</p>
          <div className="mt-2 p-2 border bg-white rounded max-h-48 overflow-y-auto">
            <strong>Detected Text:</strong>
            <pre className="text-xs">{extractedData.rawText}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
