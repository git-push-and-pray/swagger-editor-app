'use client';

import { useState } from 'react';

import type { RequestBodyObject, SchemaObject } from '@/types/openapi';

interface BodyEditorProps {
  requestBody: RequestBodyObject;
  value: unknown;
  onChange: (value: unknown) => void;
}

export default function BodyEditor({ requestBody, value, onChange }: BodyEditorProps) {
  const [jsonError, setJsonError] = useState<string | null>(null);

  const mediaTypes = Object.keys(requestBody.content || {});
  const defaultMediaType = mediaTypes[0] || 'application/json';

  const schema = requestBody.content?.[defaultMediaType]?.schema;
  const example = requestBody.content?.[defaultMediaType]?.example;

  const generateExample = (schema: SchemaObject): unknown => {
    if (schema.type === 'object') {
      const result: Record<string, unknown> = {};
      for (const [key, prop] of Object.entries(schema.properties || {})) {
        result[key] = generateExample(prop as SchemaObject);
      }
      return result;
    }
    if (schema.type === 'array') {
      return [generateExample(schema.items as SchemaObject)];
    }
    if (schema.type === 'string') return 'string';
    if (schema.type === 'number' || schema.type === 'integer') return 0;
    if (schema.type === 'boolean') return true;
    return null;
  };

  const getExample = () => {
    if (example) return JSON.stringify(example, null, 2);
    if (schema) {
      return JSON.stringify(generateExample(schema), null, 2);
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
      setJsonError('Невалидный JSON');
      onChange(text);
    }
  };

  const currentValue =
    value && typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value || '');

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h5 className="text-sm font-medium text-gray-700">Тело запроса</h5>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>{defaultMediaType}</span>
          {requestBody.required && <span className="text-red-500">*</span>}
        </div>
      </div>

      {(!value || (typeof value === 'object' && Object.keys(value).length === 0)) && (
        <button
          onClick={() => handleChange(getExample())}
          className="text-xs text-blue-500 hover:text-blue-700"
        >
          Заполнить примером
        </button>
      )}

      <textarea
        className="min-h-[120px] w-full rounded border border-gray-300 p-2 font-mono text-sm focus:border-blue-500 focus:outline-none"
        value={currentValue}
        placeholder="Введите JSON тело запроса"
        onChange={(e) => handleChange(e.target.value)}
        spellCheck={false}
      />

      {jsonError && <div className="text-xs text-red-500">{jsonError}</div>}
    </div>
  );
}
