'use client';

import { useState } from 'react';


/**
 * SummaryViewer Component
 * 
 * Displays the AI-generated summary and key points from PDF analysis.
 * Features:
 * - Toggle between summary and key points view
 * - Copy to clipboard functionality
 * - Expandable/collapsible sections
 * - Loading state support
 */

interface SummaryData {
  pdfFilename: string;
  summary: string;
  keyPoints: string[];
  createdAt?: string;
}

interface SummaryViewerProps {
  data: SummaryData | null;
  isLoading: boolean;
}

export default function SummaryViewer({ data, isLoading }: SummaryViewerProps) {
  const [activeTab, setActiveTab] = useState<'summary' | 'keypoints'>('summary');
  const [copied, setCopied] = useState(false);

  // Handle copy to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };





  // Loading state
  if (isLoading) {
    return (
      <div className="w-full bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  // No data state
  if (!data) {
    return (
      <div className="w-full bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="text-center py-12">
          <svg 
            className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
            />
          </svg>
          <p className="mt-4 text-gray-500 dark:text-gray-400">
            Upload a PDF and click "Generate Summary" to see the analysis
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header with filename */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
            </svg>
            <h2 className="font-semibold text-gray-800 dark:text-gray-200">
              {data.pdfFilename}
            </h2>
          </div>
          
          {data.createdAt && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(data.createdAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('summary')}
          className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
            activeTab === 'summary'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Summary
        </button>
        <button
          onClick={() => setActiveTab('keypoints')}
          className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
            activeTab === 'keypoints'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Key Points ({data.keyPoints.length})
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'summary' && (
          <div className="space-y-4">
            <div className="flex justify-end items-center gap-2">
              <button
                onClick={() => copyToClipboard(data.summary)}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-1 -m-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {copied ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-xs">Copied!</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs">Copy</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {data.summary}
            </p>
          </div>
        )}

        {activeTab === 'keypoints' && (
          <div className="space-y-3">
            <div className="flex justify-end">
              <button
                onClick={() => copyToClipboard(data.keyPoints.join('\n'))}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-500 transition-colors"
              >
                {copied ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy All
                  </>
                )}
              </button>
            </div>
            <ul className="space-y-3">
              {data.keyPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium">
                    {index + 1}
                  </span>
                  <p className="text-gray-700 dark:text-gray-300 pt-0.5">
                    {point}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
