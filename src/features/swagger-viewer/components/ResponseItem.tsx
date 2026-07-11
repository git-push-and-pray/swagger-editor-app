import type { ResponseObject } from 'openapi-types-v3.1.0';

import { isValidMediaObject } from '../shared/utils/typeQuards';

export default function ResponseItem({
  statusCode,
  response,
}: {
  statusCode: string;
  response: ResponseObject;
}) {
  const content = response.content;
  const hasContent = content && typeof content === 'object' && Object.keys(content).length > 0;

  return (
    <div className="rounded border border-gray-100 bg-gray-50 p-2">
      <div className="flex items-center gap-2">
        <span
          className={`text-xs font-bold ${
            statusCode.startsWith('2')
              ? 'text-green-600'
              : statusCode.startsWith('4') || statusCode.startsWith('5')
                ? 'text-red-600'
                : 'text-gray-600'
          }`}
        >
          {statusCode}
        </span>
        <span className="text-sm text-gray-700">{response.description}</span>
      </div>

      {hasContent && content && (
        <div className="mt-1">
          {Object.entries(content).map(([mediaType, mediaObject]) => {
            if (!isValidMediaObject(mediaObject)) {
              return null;
            }

            return (
              <div key={mediaType}>
                <span className="text-xs text-gray-500">{mediaType}</span>
                {mediaObject.schema && (
                  <pre className="mt-1 max-h-40 overflow-auto rounded bg-gray-800 p-2 text-xs text-gray-200">
                    {JSON.stringify(mediaObject.schema, null, 2)}
                  </pre>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
