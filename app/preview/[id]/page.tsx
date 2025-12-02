'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAction } from 'convex/react';
import { api } from '../../../convex/_generated/api';

export default function PreviewPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  interface MCQ {
    question: string;
    options: string[];
    answer: string;
  }

  interface QuestionResult {
    mcqs: MCQ[];
    theory: string[];
  }

  const [userPrompt, setUserPrompt] = useState('');
  const [selectedEngine, setSelectedEngine] = useState<'gemini' | 'huggingface'>('gemini');
  const [isGenerating, setIsGenerating] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Action to extract text from stored files
  const [extractText] = useAction(api.actions.extractText);
  // Action to generate questions
  const [generateQuestions] = useAction(api.actions.generateQuestions);

  useEffect(() => {
    const fetchExtractedText = async () => {
      try {
        setIsLoading(true);

        // Check if this is a temporary ID (starts with 'temp_') from client-side extraction
        // or a real Convex storage ID
        if (params.id.startsWith('temp_')) {
          // This is from client-side extraction, get from localStorage
          const storedText = localStorage.getItem(`extractedText_${params.id}`);
          const filename = localStorage.getItem(`filename_${params.id}`);

          if (!storedText) {
            throw new Error('No extracted text found for this document. Please try uploading again.');
          }

          setExtractedText(storedText);
        } else {
          // This is a real Convex storage ID, extract text server-side
          const text = await extractText({
            storageId: params.id // This is the Convex storage ID
          });

          setExtractedText(text);
        }
      } catch (err) {
        console.error('Error fetching extracted text:', err);
        setError('Failed to load extracted text. Please try uploading the file again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchExtractedText();
    }
  }, [params.id, extractText]);

  const handleGenerate = async () => {
    if (!extractedText) return;

    setIsGenerating(true);
    setError(null);
    try {
      // Call the generateQuestions action with the extracted text
      const result = await generateQuestions({
        text: extractedText,
        userPrompt: userPrompt || 'Generate 5 multiple choice questions and 3 theory questions based on the text',
        engine: selectedEngine
      });

      // Save the generated questions to the database
      // In a real implementation:
      // const materialId = await convex.mutation(api.mutations.uploadMaterial, {
      //   fileName: filename,
      //   originalId: params.id as unknown as Id<"_storage">,
      //   extractedText: extractedText
      // });
      //
      // await convex.mutation(api.mutations.saveGeneratedQuestions, {
      //   materialId: materialId,
      //   mcqs: result.mcqs,
      //   theory: result.theory,
      //   engine: selectedEngine
      // });

      // For now, store in localStorage
      localStorage.setItem('generatedQuestions', JSON.stringify(result));

      // Navigate to results page
      router.push(`/results`);
    } catch (error) {
      console.error('Generation error:', error);
      setError('Question generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Extracting text from your document...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Preview Text & Generate Questions</h1>
          <p className="text-gray-600 mt-2">Review the extracted text and provide instructions for question generation</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold text-gray-800">Extracted Text</h2>
              <span className="text-sm text-gray-500">{extractedText.length} characters</span>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 max-h-96 overflow-y-auto bg-gray-50">
              <p className="text-gray-700 whitespace-pre-line">{extractedText}</p>
            </div>
          </div>

          <div className="mt-6">
            <label htmlFor="user-prompt" className="block text-sm font-medium text-gray-700 mb-2">
              Instructions for Question Generation
            </label>
            <textarea
              id="user-prompt"
              rows={3}
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter instructions for generating questions (e.g., 'Focus on key concepts and create 10 MCQs and 5 theory questions')"
            />
          </div>

          <div className="mt-6">
            <label htmlFor="engine" className="block text-sm font-medium text-gray-700 mb-2">
              AI Engine
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedEngine === 'gemini'
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onClick={() => setSelectedEngine('gemini')}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="gemini"
                    checked={selectedEngine === 'gemini'}
                    onChange={() => setSelectedEngine('gemini')}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="gemini" className="ml-3 block text-sm font-medium text-gray-700">
                    <span className="font-semibold">Gemini 1.5 Flash</span>
                    <p className="text-gray-500 text-xs mt-1">Primary engine - Fast and accurate</p>
                  </label>
                </div>
              </div>

              <div
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedEngine === 'huggingface'
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onClick={() => setSelectedEngine('huggingface')}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="huggingface"
                    checked={selectedEngine === 'huggingface'}
                    onChange={() => setSelectedEngine('huggingface')}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="huggingface" className="ml-3 block text-sm font-medium text-gray-700">
                    <span className="font-semibold">HuggingFace (Backup)</span>
                    <p className="text-gray-500 text-xs mt-1">Fallback engine - Reliable alternative</p>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back to Upload
            </button>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !extractedText}
              className={`px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${
                extractedText && !isGenerating
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                  : 'bg-gray-400 cursor-not-allowed'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {isGenerating ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating Questions...
                </span>
              ) : (
                'Generate Questions'
              )}
            </button>
          </div>
        </div>

        <div className="text-center text-gray-600 text-sm">
          <p>AI will analyze the text and generate questions based on your instructions</p>
        </div>
      </div>
    </div>
  );
}