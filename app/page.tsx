'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { extractTextFromFile } from '../../utils/textExtraction';

export default function Home() {
  const router = useRouter();
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [generateUploadUrl] = useAction(api.actions.generateUploadUrl);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validate file type
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'text/plain'];
      if (!validTypes.includes(file.type) && !file.name.endsWith('.pdf') && !file.name.endsWith('.docx') && !file.name.endsWith('.pptx') && !file.name.endsWith('.txt')) {
        setError('Invalid file type. Please upload a PDF, DOCX, PPTX, or TXT file.');
        return;
      }

      setError(null);
      setUploadFile(file);
    }
  };

  const handleUpload = async () => {
    if (!uploadFile) return;

    setIsUploading(true);
    setError(null);

    try {
      // Determine if we need client-side extraction based on file type
      const needsClientExtraction = !uploadFile.type.includes('text/plain') &&
                                   !uploadFile.name.endsWith('.txt');

      let storageId;

      if (needsClientExtraction) {
        // For complex files, extract text client-side first, then upload the extracted text
        const extractedText = await extractTextFromFile(uploadFile);

        // In a real implementation, we might want to upload the extracted text as a text file
        // For now, we'll pass it directly to the preview page using localStorage
        const tempId = `temp_${Date.now()}`;
        localStorage.setItem(`extractedText_${tempId}`, extractedText);
        localStorage.setItem(`filename_${tempId}`, uploadFile.name);

        // Navigate to preview page with temp ID
        router.push(`/preview/${tempId}`);
      } else {
        // For text files, upload directly to Convex storage
        const { uploadUrl } = await generateUploadUrl({});

        // Upload the file to Convex storage using the generated URL
        const response = await fetch(uploadUrl, {
          method: 'POST',
          body: uploadFile,
          headers: {
            'Content-Type': uploadFile.type || 'application/octet-stream'
          }
        });

        if (!response.ok) {
          throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
        }

        // Get the storage ID from the response headers
        storageId = response.headers.get('X-Convex-Storage-Id');
        if (!storageId) {
          throw new Error('No storage ID returned from upload');
        }

        // Navigate to text preview page with the storage ID
        router.push(`/preview/${storageId}`);
      }

    } catch (error) {
      console.error('Upload error:', error);
      setError('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              EduQuest
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform your learning materials into exam questions with AI. Upload your documents and generate MCQs and theory questions instantly.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-8 sm:p-10">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">How it works</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="bg-blue-50 p-5 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mb-3">1</div>
                  <h3 className="font-semibold text-gray-800">Upload Material</h3>
                  <p className="text-gray-600 text-sm mt-1">Upload PDF, DOCX, PPTX, or TXT files containing your learning content</p>
                </div>
                <div className="bg-purple-50 p-5 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold mb-3">2</div>
                  <h3 className="font-semibold text-gray-800">AI Processing</h3>
                  <p className="text-gray-600 text-sm mt-1">Our AI analyzes your content and generates relevant questions</p>
                </div>
                <div className="bg-indigo-50 p-5 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold mb-3">3</div>
                  <h3 className="font-semibold text-gray-800">Download Results</h3>
                  <p className="text-gray-600 text-sm mt-1">Get your questions in PDF, DOCX, or TXT format</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center transition-all hover:border-indigo-400">
                <div className="mb-4 flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
                    <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Upload Learning Material</h3>
                <p className="text-sm text-gray-500 mb-4">PDF, DOCX, PPTX, or TXT files</p>
                <input
                  type="file"
                  accept=".pdf,.docx,.pptx,.txt"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                  Select File
                </label>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {uploadFile && (
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg flex items-center justify-between">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    <span className="text-green-800 font-medium">Selected: {uploadFile.name}</span>
                  </div>
                  <button
                    onClick={() => setUploadFile(null)}
                    className="text-green-700 hover:text-green-900"
                  >
                    Change
                  </button>
                </div>
              )}

              <button
                onClick={handleUpload}
                disabled={!uploadFile || isUploading}
                className={`w-full flex justify-center items-center px-6 py-4 border border-transparent text-lg font-medium rounded-lg shadow-sm text-white ${
                  uploadFile && !isUploading
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                    : 'bg-gray-400 cursor-not-allowed'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                {isUploading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Upload & Generate Questions'
                )}
              </button>
            </div>

            <div className="mt-10 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Supported Formats</h3>
              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  PDF
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  DOCX
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                  PPTX
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                  TXT
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>No account required. Your documents are processed securely and not stored permanently.</p>
        </div>
      </div>
    </div>
  );
}