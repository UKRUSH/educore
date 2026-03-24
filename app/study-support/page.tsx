'use client';

import { useState, useCallback } from 'react';
import PDFUploader from '@/components/PDFUploader';
import SummaryViewer from '@/components/SummaryViewer';
import ResourceSuggestions from '@/components/ResourceSuggestions';

/**
 * Study Support System Page
 * 
 * Main page for the AI-powered Study Material Support System.
 * Features:
 * - PDF file upload with drag-and-drop
 * - Generate summary button
 * - Display AI-generated summary and key points
 * - Display recommended learning resources
 * - Real-time processing status
 */

interface StudyMaterialData {
  pdfFilename: string;
  summary: string;
  keyPoints: string[];
  resourceUrls: string[];
  createdAt?: string;
}

export default function StudySupportPage() {
  // State management
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [studyMaterial, setStudyMaterial] = useState<StudyMaterialData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Handle file selection from uploader
  const handleFileSelect = useCallback((files: File[]) => {
    setSelectedFiles(files);
    setError(null);
  }, []);

  // Handle form submission - upload PDF and get AI analysis
  const handleGenerateSummary = async () => {
    // Validate files
    if (selectedFiles.length === 0) {
      setError('Please select at least one PDF file');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Process only the first file for now
      const file = selectedFiles[0];
      
      // Create FormData and append the file
      const formData = new FormData();
      formData.append('file', file);

      // Send to API
      const response = await fetch('/api/study-support', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to process PDF');
      }

      // Update state with results
      setStudyMaterial({
        pdfFilename: result.data.pdfFilename,
        summary: result.data.summary,
        keyPoints: result.data.keyPoints,
        resourceUrls: result.data.resourceUrls,
        createdAt: result.data.createdAt,
      });

    } catch (err) {
      console.error('Error processing PDF:', err);
      let errorMessage = 'An error occurred while processing your PDF';
      
      if (err instanceof Error) {
        if (err.message.includes('Failed to generate summary') || err.message.includes('GEMINI')) {
          errorMessage = 'AI service temporarily unavailable. Please check your internet connection and try again. (Tip: Ensure GEMINI_API_KEY is set in .env.local)';
        } else if (err.message.includes('No text found') || err.message.includes('PDF')) {
          errorMessage = 'Could not extract text from PDF. Please try a different file or ensure it contains readable text.';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle reset - clear all data
  const handleReset = () => {
    setSelectedFiles([]);
    setStudyMaterial(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Study Support System
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Upload your PDF study materials and get AI-powered summaries with learning resources
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Upload and Generate */}
          <div className="space-y-6">
            {/* Upload Section */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Upload PDF
              </h2>
              <PDFUploader 
                onFileSelect={handleFileSelect}
                isProcessing={isProcessing}
              />
            </div>

            {/* Generate Button */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleGenerateSummary}
                disabled={selectedFiles.length === 0 || isProcessing}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  selectedFiles.length === 0 || isProcessing
                    ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                }`}
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Generate Summary
                  </>
                )}
              </button>

              {/* Reset Button */}
              {(studyMaterial || selectedFiles.length > 0) && (
                <button
                  onClick={handleReset}
                  disabled={isProcessing}
                  className="px-6 py-3 rounded-lg font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-400">
                      Error
                    </h3>
                    <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}


          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            {/* Summary Viewer */}
            <SummaryViewer 
              data={studyMaterial}
              isLoading={isProcessing}
            />

            {/* Resource Suggestions */}
            <ResourceSuggestions 
              resources={studyMaterial?.resourceUrls || []}
              isLoading={isProcessing}
            />
          </div>
        </div>

        {/* Features Info */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                PDF Text Extraction
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Upload your PDF study materials and our system will extract all the text content for analysis.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                AI Summarization
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Get intelligent summaries and key points extracted from your study materials using advanced AI.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                Learning Resources
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Receive personalized resource suggestions including articles, videos, and documentation to enhance your learning.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

