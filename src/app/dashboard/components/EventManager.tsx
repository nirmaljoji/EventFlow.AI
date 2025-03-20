"use client";

import { useEffect, useState } from 'react';
import { NotionRenderer } from 'react-notion-x';
import { ExtendedRecordMap } from 'notion-types';
import { NotionPage } from '../components/NotionPage'
import {
    previewImagesEnabled,
    rootNotionPageId
  } from '../config/config'

// Import required styles
import 'react-notion-x/src/styles.css';
import 'prismjs/themes/prism-tomorrow.css';
import 'katex/dist/katex.min.css';

interface NotionError {
  error: string;
  details?: string;
  code?: string;
}

export default function EventManager() {
  const [recordMap, setRecordMap] = useState<ExtendedRecordMap | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<NotionError | null>(null);

  useEffect(() => {
    const fetchNotionData = async () => {
      try {
        const response = await fetch('/api/notion');
        const data = await response.json();

        if (!response.ok) {
          setError(data as NotionError);
          setLoading(false);
          return;
        }

        setRecordMap(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching Notion data:', err);
        setError({
          error: 'Failed to fetch Notion data',
          details: err instanceof Error ? err.message : 'Unknown error occurred'
        });
        setLoading(false);
      }
    };

    fetchNotionData();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-red-500 p-4">
        <h3 className="text-xl font-semibold mb-2">{error.error}</h3>
        {error.details && (
          <p className="text-sm text-red-400 mb-2">{error.details}</p>
        )}
        {error.code && (
          <p className="text-xs text-red-300">Error Code: {error.code}</p>
        )}
      </div>
    );
  }

  if (!recordMap) {
    return (
      <div className="h-full flex items-center justify-center">
        <p>No content available</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto overflow-x-hidden bg-white dark:bg-gray-900 py-8">
      <div>
            <NotionPage
            recordMap={recordMap}
            rootPageId={rootNotionPageId}
            previewImagesEnabled={previewImagesEnabled}
            />
      </div>
    </div>
  );
} 