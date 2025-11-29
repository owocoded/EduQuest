'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { exportToPdf } from '../../utils/exportPdf';
import { exportToDocx } from '../../utils/exportDocx';
import { exportToTxt } from '../../utils/exportTxt';

export default function ResultsPage() {
  const router = useRouter();

  interface MCQ {
    question: string;
    options: string[];
    answer: string;
  }

  interface QuestionData {
    mcqs: MCQ[];
    theory: string[];
  }

  const [questions, setQuestions] = useState<QuestionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get the generated questions from localStorage (placeholder)
    const storedQuestions = localStorage.getItem('generatedQuestions');
    if (storedQuestions) {
      try {
        const parsedQuestions = JSON.parse(storedQuestions);
        setQuestions(parsedQuestions);
      } catch (error) {
        console.error('Error parsing stored questions:', error);
        router.push('/');
      }
    } else {
      // If no questions found, redirect to home
      router.push('/');
    }
    setLoading(false);
  }, [router]);

  const handleDownloadPDF = () => {
    if (!questions) return;
    exportToPdf(questions, 'generated_questions.pdf');
  };

  const handleDownloadDOCX = () => {
    if (!questions) return;
    exportToDocx(questions, 'generated_questions.docx');
  };

  const handleDownloadTXT = () => {
    if (!questions) return;
    exportToTxt(questions, 'generated_questions.txt');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!questions) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">No questions found. Please go back and generate questions.</p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Generated Questions</h1>
          <p className="text-gray-600 mt-2">Your AI-generated exam questions are ready</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          {/* MCQs Section */}
          {questions.mcqs && questions.mcqs.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Multiple Choice Questions</h2>
              <div className="space-y-6">
                {questions.mcqs.map((mcq: any, index: number) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                    <h3 className="font-medium text-gray-800">Question {index + 1}: {mcq.question}</h3>
                    <div className="mt-3 ml-4 space-y-2">
                      {mcq.options.map((option: string, optIndex: number) => (
                        <div key={optIndex} className="flex items-start">
                          <span className="mr-2 font-medium text-indigo-600">•</span>
                          <span>{option}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <span className="text-sm font-medium text-green-600">Answer: {mcq.answer}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Theory Questions Section */}
          {questions.theory && questions.theory.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Theory Questions</h2>
              <div className="space-y-4">
                {questions.theory.map((theory: string, index: number) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                    <h3 className="font-medium text-gray-800">Question {index + 1}: {theory}</h3>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Download Options */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Download Results</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Download PDF
            </button>
            <button
              onClick={handleDownloadDOCX}
              className="px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Download DOCX
            </button>
            <button
              onClick={handleDownloadTXT}
              className="px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Download TXT
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Generate More Questions
          </button>
        </div>
      </div>
    </div>
  );
}