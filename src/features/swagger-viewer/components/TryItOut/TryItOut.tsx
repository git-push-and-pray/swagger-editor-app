'use client';

import { useState } from 'react';

import type { Endpoint, ProxyResponse } from '@/types/openapi';

import { generateCurl } from '../../services/curlGenerator';
import { sendRequest } from '../../services/proxyService';
import BodyEditor from './BodyEditor';
import ParameterInputs from './ParameterInputs';
import ResponseDisplay from './ResponseDisplay';

interface TryItOutProps {
  endpoint: Endpoint;
}

export default function TryItOut({ endpoint }: TryItOutProps) {
  const [isTryItOut, setIsTryItOut] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [response, setResponse] = useState<ProxyResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [parameters, setParameters] = useState<Record<string, unknown>>({});
  const [headers, setHeaders] = useState<Record<string, string>>({});
  const [body, setBody] = useState<unknown>(null);
  const [isCopied, setIsCopied] = useState(false);

  const handleExecute = async () => {
    setIsExecuting(true);
    setError(null);

    try {
      let baseUrl = '';

      if (endpoint.servers && endpoint.servers.length > 0) {
        baseUrl = endpoint.servers[0].url;
      }

      if (baseUrl.endsWith('/')) {
        baseUrl = baseUrl.slice(0, -1);
      }

      let url = baseUrl + endpoint.path;
      for (const param of endpoint.parameters) {
        if (param.in === 'path') {
          const value = parameters[param.name];
          if (value) {
            url = url.replace(`{${param.name}}`, String(value));
          }
        }
      }

      const queryParams = new URLSearchParams();
      for (const param of endpoint.parameters) {
        if (param.in === 'query') {
          const value = parameters[param.name];
          if (value) {
            queryParams.append(param.name, String(value));
          }
        }
      }
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }

      const requestHeaders: Record<string, string> = {};
      for (const param of endpoint.parameters) {
        if (param.in === 'header') {
          const value = headers[param.name] || parameters[param.name];
          if (value) {
            requestHeaders[param.name] = String(value);
          }
        }
      }

      const result = await sendRequest({
        url,
        method: endpoint.method,
        headers: requestHeaders,
        body,
      });

      setResponse(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsExecuting(false);
    }
  };

  const handleCopyCurl = () => {
    try {
      let baseUrl = '';

      if (endpoint.servers && endpoint.servers.length > 0) {
        baseUrl = endpoint.servers[0].url;
      }

      if (baseUrl.endsWith('/')) {
        baseUrl = baseUrl.slice(0, -1);
      }

      let url = baseUrl + endpoint.path;

      for (const param of endpoint.parameters) {
        if (param.in === 'path') {
          const value = parameters[param.name];
          if (value) {
            url = url.replace(`{${param.name}}`, String(value));
          }
        }
      }

      const queryParams = new URLSearchParams();
      for (const param of endpoint.parameters) {
        if (param.in === 'query') {
          const value = parameters[param.name];
          if (value) {
            queryParams.append(param.name, String(value));
          }
        }
      }
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }
      const requestHeaders: Record<string, string> = {};
      for (const param of endpoint.parameters) {
        if (param.in === 'header') {
          const value = headers[param.name] || parameters[param.name];
          if (value) {
            requestHeaders[param.name] = String(value);
          }
        }
      }

      const curl = generateCurl({
        method: endpoint.method,
        url,
        headers: requestHeaders,
        body,
      });

      navigator.clipboard.writeText(curl).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 3000);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate cURL');
    }
  };

  return (
    <>
      <button
        onClick={() => setIsTryItOut(!isTryItOut)}
        className="mt-4 rounded bg-blue-500 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-blue-600"
      >
        {isTryItOut ? ' Cancel' : ' Try it out'}
      </button>

      {isTryItOut && (
        <div className="mt-4 space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Try It Out</h4>
            <button
              onClick={() => setIsTryItOut(false)}
              className="text-sm text-gray-700 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {endpoint.parameters.length > 0 && (
            <ParameterInputs
              parameters={endpoint.parameters}
              values={parameters}
              onChange={setParameters}
            />
          )}

          <div>
            <label className="text-sm font-medium text-gray-700">Headers</label>
            <div className="mt-1">
              <input
                type="text"
                placeholder="Content-Type: application/json"
                className="w-full rounded border border-gray-300 p-2 text-sm"
                onChange={(e) => {
                  const [key, value] = e.target.value.split(':');
                  if (key && value) {
                    setHeaders((prev) => ({ ...prev, [key.trim()]: value.trim() }));
                  }
                }}
              />
            </div>
          </div>

          {endpoint.requestBody && (
            <BodyEditor requestBody={endpoint.requestBody} value={body} onChange={setBody} />
          )}

          <div className="flex gap-2">
            <button
              onClick={handleExecute}
              disabled={isExecuting}
              className={`rounded bg-green-500 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-green-600 ${
                isExecuting ? 'opacity-50' : ''
              }`}
            >
              {isExecuting ? '⏳ Executing...' : '▶ Execute'}
            </button>

            <button
              onClick={handleCopyCurl}
              className="rounded bg-gray-500 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-600"
            >
              Generate cURL
            </button>
          </div>

          {isCopied && (
            <div className="rounded bg-green-100 p-2 text-sm text-green-700">
              ✅ cURL команда скопирована в буфер обмена!
            </div>
          )}

          {error && <div className="rounded bg-red-100 p-3 text-sm text-red-700">{error}</div>}

          {response && <ResponseDisplay response={response} />}
        </div>
      )}
    </>
  );
}
