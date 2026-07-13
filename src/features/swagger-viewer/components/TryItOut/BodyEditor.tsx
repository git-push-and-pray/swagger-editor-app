'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import type { RequestBodyObject, SchemaObject } from '@/types/openapi';

import { generateExample } from '../../shared/utils/generateExample';

interface BodyEditorProps {
  requestBody: RequestBodyObject;
  value: unknown;
  onChange: (value: unknown) => void;
}

export default function BodyEditor({ requestBody, value, onChange }: BodyEditorProps) {
  const t = useTranslations('SwaggerViewer');
  const [jsonError, setJsonError] = useState<string | null>(null);

  const mediaTypes = Object.keys(requestBody.content || {});
  const defaultMediaType = mediaTypes[0] || 'application/json';

  const schema = requestBody.content?.[defaultMediaType]?.schema;
  const example = requestBody.content?.[defaultMediaType]?.example;

  const getExample = () => {
    if (example) return JSON.stringify(example, null, 2);
    if (schema) {
      return JSON.stringify(generateExample(schema as SchemaObject), null, 2);
    }
    return '{\n  \n}';
  };

  const handleChange = (text: string) => {
    try {
      if (text.trim()) {
        const parsed = JSON.parse(text);
        onChange(parsed);
        setJsonError(null);
      } else {
        onChange(null);
        setJsonError(null);
      }
    } catch {
      setJsonError(t('bodyEditor.invalidJson'));
      onChange(text);
    }
  };

  const currentValue =
    value && typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value || '');

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h5 className="text-text-primary text-sm font-medium">{t('bodyEditor.title')}</h5>
        <div className="text-text-secondary flex items-center gap-2 text-xs">
          <span>{defaultMediaType}</span>
          {requestBody.required && <span className="text-errordark">*</span>}
        </div>
      </div>

      {(!value || (typeof value === 'object' && Object.keys(value).length === 0)) && (
        <button
          onClick={() => handleChange(getExample())}
          className="text-info hover:text-infodark text-xs"
        >
          {t('bodyEditor.fillExample')}
        </button>
      )}

      <textarea
        className="border-border focus:border-info min-h-30 w-full rounded border p-2 font-mono text-sm focus:outline-none"
        value={currentValue}
        placeholder={t('bodyEditor.placeholder')}
        onChange={(e) => handleChange(e.target.value)}
        spellCheck={false}
      />

      {jsonError && <div className="text-errordark text-xs">{jsonError}</div>}
    </div>
  );
}
