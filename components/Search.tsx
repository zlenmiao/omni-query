'use client';

import { useState, useCallback } from 'react';
import { searchWithAI } from '@/services/ai';
import type { SearchResult } from '@/services/ai';
import Markdown from './Markdown';
import copy from 'clipboard-copy';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';

function stripMarkdown(text: string): string {
  return text.replace(/[#*`]/g, '').replace(/\n+/g, ' ').trim();
}

export default function Search() {
  const t = useTranslations('search'); // Fix translations
  const locale = useLocale();
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copying' | 'success' | 'error'>('idle');
  const [lastCopyType, setLastCopyType] = useState<'text' | 'markdown' | null>(null);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) {
      setError(t('error.empty'));
      return;
    }

    if (query.length > 100) {
      setError(t('error.tooLong'));
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const searchResult = await searchWithAI(query, locale);
      setResult(searchResult);
    } catch (err) {
      setError(t('error.failed'));
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  }, [query, locale, t]);

  const handleCopy = useCallback(async (isMarkdown: boolean) => {
    if (!result) return;

    const type = isMarkdown ? 'markdown' : 'text';
    setLastCopyType(type);
    setCopyStatus('copying');

    try {
      const content = isMarkdown ? result.content : stripMarkdown(result.content);
      await copy(content);
      setCopyStatus('success');
      setTimeout(() => {
        setCopyStatus('idle');
        setLastCopyType(null);
      }, 2000);
    } catch (err) {
      console.error('Copy failed:', err);
      setError(t('error.copyFailed'));
      setCopyStatus('error');
    }
  }, [result, t]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={t('placeholder')}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? t('loading') : t('button')}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {result && !error && (
        <div className="relative bg-white rounded-lg shadow-lg p-6">
          <div className="flex space-x-2 mb-2">
            <button
              onClick={() => handleCopy(false)}
              disabled={!result || copyStatus === 'copying'}
              className={`px-3 py-1 text-sm rounded ${
                copyStatus === 'success' && lastCopyType === 'text'
                  ? 'bg-green-500 text-white'
                  : copyStatus === 'error'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
              data-testid="copy-text-button"
            >
              {copyStatus === 'copying' && lastCopyType === 'text'
                ? t('copy.copying')
                : copyStatus === 'success' && lastCopyType === 'text'
                ? t('copy.success')
                : t('copy.text')}
            </button>
            <button
              onClick={() => handleCopy(true)}
              disabled={!result || copyStatus === 'copying'}
              className={`px-3 py-1 text-sm rounded ${
                copyStatus === 'success' && lastCopyType === 'markdown'
                  ? 'bg-green-500 text-white'
                  : copyStatus === 'error'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
              data-testid="copy-markdown-button"
            >
              {copyStatus === 'copying' && lastCopyType === 'markdown'
                ? t('copy.copying')
                : copyStatus === 'success' && lastCopyType === 'markdown'
                ? t('copy.success')
                : t('copy.markdown')}
            </button>
          </div>
          <Markdown content={result.content} className="mt-2" />
        </div>
      )}
    </div>
  );
}
