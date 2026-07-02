// 'use client';

// import { useSwaggerContext } from '@/context/SwaggerContext';

// export function SwaggerViewer() {
//   const { schema, format } = useSwaggerContext();

//   // TODO: Пока просто отображаем схему
//   return (
//     <div className="p-4">
//       <h2>Swagger Viewer</h2>
//       <div className="mt-4">
//         <div className="text-sm text-gray-500">
//           Format: {format}
//         </div>
//         <pre className="mt-2 p-4 bg-gray-100 rounded overflow-auto max-h-96">
//           {schema}
//         </pre>
//       </div>
//     </div>
//   );
// }

// src/features/swagger-viewer/Viewer.tsx
'use client';

import { useSwaggerContext } from '@/context/SwaggerContext';
import { OpenAPIObject } from '@/types/openapi';
import YAML from 'yaml';
import { useState, useEffect } from 'react';

interface ParsedSchema {
  isValid: boolean;
  data: OpenAPIObject | null;
  error?: string;
}

export function SwaggerViewer() {
  const { schema, format } = useSwaggerContext();
  //   const schema = `
  // openapi: 3.1.0
  // info:
  //   title: Test API
  //   version: 1.0.0
  // paths:
  //   /users:
  //     get:
  //       summary: Get users
  //       responses:
  //         '200':
  //           description: OK
  //   `;
  //   const format = 'yaml';
  const [parsed, setParsed] = useState<ParsedSchema>({
    isValid: false,
    data: null,
  });

  // useEffect(() => {
  //   try {
  //     let jsonObject: any;

  //     if (format === 'yaml') {
  //       jsonObject = YAML.parse(schema);
  //     } else {
  //       jsonObject = JSON.parse(schema);
  //     }

  //     // Проверяем, что это OpenAPI схема
  //     if (!jsonObject.openapi) {
  //       throw new Error('Не является OpenAPI схемой (отсутствует поле openapi)');
  //     }

  //     setParsed({
  //       isValid: true,
  //       data: jsonObject as OpenAPIObject,
  //     });
  //   } catch (error) {
  //     setParsed({
  //       isValid: false,
  //       data: null,
  //       error: error instanceof Error ? error.message : 'Ошибка парсинга',
  //     });
  //   }
  // }, [schema, format]);

  useEffect(() => {
    try {
      console.log('📝 Получена схема:', schema);
      console.log('📝 Формат:', format);
      console.log('📝 Тип schema:', typeof schema);

      let jsonObject: any;

      if (format === 'yaml') {
        console.log('🔄 Парсим YAML...');
        jsonObject = YAML.parse(schema);
        console.log('✅ Результат парсинга:', jsonObject);
      } else {
        console.log('🔄 Парсим JSON...');
        jsonObject = JSON.parse(schema);
        console.log('✅ Результат парсинга:', jsonObject);
      }

      console.log('🔍 Проверяем openapi:', jsonObject.openapi);

      if (!jsonObject.openapi) {
        throw new Error('Не является OpenAPI схемой (отсутствует поле openapi)');
      }

      setParsed({
        isValid: true,
        data: jsonObject as OpenAPIObject,
      });
    } catch (error) {
      console.error('❌ Ошибка:', error);
      setParsed({
        isValid: false,
        data: null,
        error: error instanceof Error ? error.message : 'Ошибка парсинга',
      });
    }
  }, [schema, format]);

  // Отображение ошибок
  if (!parsed.isValid) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 rounded-lg">
        <h3 className="text-red-700 font-semibold">❌ Ошибка валидации</h3>
        <p className="text-red-600 mt-1">{parsed.error}</p>
        <div className="mt-2 text-xs text-gray-500">
          Формат: {format}
        </div>
      </div>
    );
  }

  // Отображение эндпоинтов
  const endpoints = extractEndpoints(parsed.data!);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">🔍 Swagger Viewer</h2>
        <span className="text-sm text-gray-500">
          {endpoints.length} эндпоинтов
        </span>
      </div>

      {endpoints.length === 0 ? (
        <div className="text-gray-500 text-center py-8">
          Нет эндпоинтов для отображения
        </div>
      ) : (
        <div className="space-y-2">
          {endpoints.map((endpoint, index) => (
            <div
              key={index}
              className="border rounded-lg p-3 hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs font-bold px-2 py-1 rounded ${
                    endpoint.method === 'GET'
                      ? 'bg-blue-100 text-blue-700'
                      : endpoint.method === 'POST'
                      ? 'bg-green-100 text-green-700'
                      : endpoint.method === 'PUT'
                      ? 'bg-yellow-100 text-yellow-700'
                      : endpoint.method === 'DELETE'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {endpoint.method}
                </span>
                <span className="font-mono text-sm">{endpoint.path}</span>
                {endpoint.summary && (
                  <span className="text-sm text-gray-500 ml-2">
                    {endpoint.summary}
                  </span>
                )}
                {endpoint.tags.length > 0 && (
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded ml-auto">
                    {endpoint.tags.join(', ')}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Временная функция-заглушка для экстракции
// (пока просто возвращает базовые данные)
function extractEndpoints(schema: OpenAPIObject) {
  const endpoints: Array<{
    method: string;
    path: string;
    summary?: string;
    tags: string[];
  }> = [];

  if (!schema.paths) return endpoints;

  for (const [path, pathItem] of Object.entries(schema.paths)) {
    const methods = ['get', 'post', 'put', 'delete', 'patch', 'head', 'options'] as const;

    for (const method of methods) {
      const operation = pathItem[method as keyof typeof pathItem] as any;
      if (!operation) continue;

      endpoints.push({
        method: method.toUpperCase(),
        path,
        summary: operation.summary,
        tags: operation.tags || [],
      });
    }
  }

  return endpoints;
}