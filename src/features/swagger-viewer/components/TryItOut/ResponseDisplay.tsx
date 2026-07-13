'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import type { ProxyResponse } from '@/types/openapi';

interface ResponseDisplayProps {
  response: ProxyResponse;
}

export default function ResponseDisplay({ response }: ResponseDisplayProps) {
  const t = useTranslations('SwaggerViewer');
  const [activeTab, setActiveTab] = useState<'body' | 'headers' | 'info'>('body');

  const formatBody = () => {
    if (!response.body) return 'null';

    if (typeof response.body === 'string') {
      try {
        const parsed = JSON.parse(response.body);
        return JSON.stringify(parsed, null, 2);
      } catch {
        return response.body;
      }
    }

    return JSON.stringify(response.body, null, 2);
  };

  const isSuccess = response.status >= 200 && response.status < 300;
  const statusColor = isSuccess ? 'text-green-600' : 'text-red-600';

  const tabs: Array<{ id: 'body' | 'headers' | 'info'; label: string }> = [
    { id: 'body', label: t('responseDisplay.body') },
    { id: 'headers', label: t('responseDisplay.headers') },
    { id: 'info', label: t('responseDisplay.info') },
  ];

  return (
    <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={`text-sm font-bold ${statusColor}`}>
            {response.status} {response.statusText}
          </span>
          <span className="text-xs text-gray-500">{response.duration}ms</span>
        </div>
      </div>

      <div className="flex gap-2 border-b border-gray-200 pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-2 py-1 text-xs font-medium ${
              activeTab === tab.id
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div>
        {activeTab === 'body' && (
          <pre className="max-h-60 overflow-auto rounded bg-gray-50 p-2 text-xs text-gray-800">
            {formatBody()}
          </pre>
        )}

        {activeTab === 'headers' && (
          <div className="space-y-1">
            {Object.entries(response.headers).map(([key, value]) => (
              <div key={key} className="flex gap-2 text-xs">
                <span className="font-semibold text-gray-700">{key}:</span>
                <span className="text-gray-600">{String(value)}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'info' && (
          <div className="space-y-1 text-xs">
            <div>
              <span className="font-semibold text-gray-700">{t('responseDisplay.status')}</span>{' '}
              <span className={statusColor}>{response.status}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">{t('responseDisplay.duration')}</span>{' '}
              {response.duration}ms
            </div>
            {response.error && (
              <div>
                <span className="font-semibold text-red-600">{t('responseDisplay.error')}</span>{' '}
                <span className="text-red-600">{response.error}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
