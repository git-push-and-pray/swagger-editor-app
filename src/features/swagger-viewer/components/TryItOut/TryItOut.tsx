'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import Button from '@/components/ui/Button';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { saveRequestHistory } from '@/features/history/services/saveRequestHistory';
import type { Endpoint, ProxyResponse } from '@/types/openapi';

import { generateCurl } from '../../services/curlGenerator';
import { sendRequest } from '../../services/proxyService';
import { formatResponseBody } from '../../shared/utils/formatResponseBody';
import BodyEditor from './BodyEditor';
import ParameterInputs from './ParameterInputs';
import ResponseDisplay from './ResponseDisplay';

interface TryItOutProps {
  endpoint: Endpoint;
}

export default function TryItOut({ endpoint }: TryItOutProps) {
  const t = useTranslations('SwaggerViewer');
  const { user } = useAuth();

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
      const errorDetails = result.status >= 400 ? formatResponseBody(result.body) : undefined;

      setResponse(result);

      if (user) {
        try {
          await saveRequestHistory({
            endpoint: endpoint.path,
            method: endpoint.method,
            url,
            status: result.status || 0,
            duration: result.duration || 0,
            requestSize: new Blob([JSON.stringify(body)]).size,
            responseSize: new Blob([result.body]).size,
            errorDetails,
          });
        } catch {
          toast.error(t('saveHistoryError'));
        }
      }
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
      <Button
        size="sm"
        btnVersion="primary"
        onClick={() => setIsTryItOut(!isTryItOut)}
        name={isTryItOut ? t('tryItOut.cancel') : t('tryItOut.button')}
      />

      {isTryItOut && (
        <div className="border-border bg-surface mt-4 space-y-4 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">{t('tryItOut.title')}</h4>
          </div>

          {endpoint.parameters.length > 0 && (
            <ParameterInputs
              parameters={endpoint.parameters}
              values={parameters}
              onChange={setParameters}
            />
          )}

          <div>
            <label className="text-text-primary text-sm font-medium">{t('tryItOut.headers')}</label>
            <div className="mt-1">
              <input
                type="text"
                placeholder={t('tryItOut.placeholder')}
                className="border-border focus:border-info w-full rounded border p-2 text-sm focus:outline-none"
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
            <Button
              icon="play"
              size="xs"
              btnVersion="primary"
              onClick={handleExecute}
              name={isExecuting ? t('tryItOut.executing') : t('tryItOut.execute')}
            />

            <Button
              icon="copy"
              size="xs"
              btnVersion="secondary"
              onClick={handleCopyCurl}
              name={t('tryItOut.generateCurl')}
            />
          </div>

          {isCopied && (
            <div className="bg-accent/20 text-accentdark rounded p-2 text-sm">
              {t('tryItOut.copied')}
            </div>
          )}

          {error && <div className="bg-error/15 text-errordark rounded p-3 text-sm">{error}</div>}

          {response && <ResponseDisplay response={response} />}
        </div>
      )}
    </>
  );
}
