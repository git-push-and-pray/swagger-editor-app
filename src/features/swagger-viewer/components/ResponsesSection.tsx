'use client';

import type { ResponseObject, ResponsesObject } from '@/types/openapi';

import { isValidResponse } from '../shared/utils/typeQuards';
import ResponseItem from './ResponseItem';

interface ResponsesSectionProps {
  responses: ResponsesObject;
}

export default function ResponsesSection({ responses }: ResponsesSectionProps) {
  const validResponses = Object.entries(responses)
    .filter(([, response]) => isValidResponse(response))
    .map(([statusCode, response]) => ({
      statusCode,
      response: response as ResponseObject,
    }));

  if (validResponses.length === 0) {
    return (
      <div>
        <h4 className="text-sm font-semibold text-gray-700">Ответы</h4>
        <p className="mt-1 text-sm text-gray-500">Нет описаний ответов</p>
      </div>
    );
  }

  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-700">Ответы</h4>
      <div className="mt-2 space-y-2">
        {validResponses.map(({ statusCode, response }) => (
          <ResponseItem key={statusCode} statusCode={statusCode} response={response} />
        ))}
      </div>
    </div>
  );
}
