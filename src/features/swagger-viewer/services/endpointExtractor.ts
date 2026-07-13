import type { OpenAPI } from 'openapi-types';

import type {
  ComponentsObject,
  Endpoint,
  HttpMethod,
  MediaTypeObject,
  OpenAPIObject,
  ParameterObject,
  RequestBodyObject,
  ResponseObject,
  ResponsesObject,
} from '@/types/openapi';
import { resolveParameters, resolveRequestBody, resolveSchemaDeep } from '@/types/openapi';

import { isOperationObject } from '../shared/utils/typeQuards';

export function extractEndpoints(schema: OpenAPI.Document): Endpoint[] {
  const endpoints: Endpoint[] = [];

  const openApiObject = schema as unknown as OpenAPIObject;

  if (!openApiObject.paths) {
    return endpoints;
  }

  const components = openApiObject.components;

  const rootServers = openApiObject.servers || [];

  for (const [path, pathItem] of Object.entries(openApiObject.paths)) {
    const methods: HttpMethod[] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];

    for (const method of methods) {
      const methodKey = method.toLowerCase() as keyof typeof pathItem;

      const operation = pathItem[methodKey] as unknown;

      if (!isOperationObject(operation)) continue;

      const operationParams = resolveParameters(operation.parameters || [], components);

      const pathParams = resolveParameters(pathItem.parameters || [], components);

      const parameters = extractParameters(operationParams, pathParams);

      const requestBody = operation.requestBody
        ? resolveRequestBody(operation.requestBody, components)
        : undefined;

      const resolvedRequestBody = requestBody
        ? resolveRequestBodySchemas(requestBody, components)
        : undefined;

      const responses = extractResponses(operation.responses, components);

      const servers = operation.servers || pathItem.servers || rootServers;

      endpoints.push({
        method,
        path,
        summary: operation.summary,
        description: operation.description,
        operationId: operation.operationId,
        tags: operation.tags || [],
        parameters,
        requestBody: resolvedRequestBody,
        responses,
        security: operation.security,
        deprecated: operation.deprecated,
        servers,
        externalDocs: operation.externalDocs,
      });
    }
  }

  return endpoints;
}

export function extractParameters(
  operationParams: ParameterObject[] = [],
  pathParams: ParameterObject[] = []
): ParameterObject[] {
  const paramMap = new Map<string, ParameterObject>();

  for (const param of pathParams) {
    const key = `${param.name}-${param.in}`;
    paramMap.set(key, param);
  }

  for (const param of operationParams) {
    const key = `${param.name}-${param.in}`;
    paramMap.set(key, param);
  }

  return Array.from(paramMap.values());
}

export function extractRequestBody(requestBody: RequestBodyObject): RequestBodyObject {
  return {
    description: requestBody.description,
    content: requestBody.content,
    required: requestBody.required,
  };
}

export function extractResponses(
  responses: ResponsesObject,
  components?: ComponentsObject
): ResponsesObject {
  const result: ResponsesObject = {};

  for (const [statusCode, response] of Object.entries(responses)) {
    result[statusCode] = resolveResponseSchemas(
      extractResponse(response as ResponseObject),
      components
    );
  }

  return result;
}

export function extractResponse(response: ResponseObject): ResponseObject {
  return {
    description: response.description,
    content: response.content,
    headers: response.headers,
    links: response.links,
  };
}

export function groupEndpointsByTag(endpoints: Endpoint[]): Map<string, Endpoint[]> {
  const groups = new Map<string, Endpoint[]>();

  for (const endpoint of endpoints) {
    const tags = endpoint.tags.length > 0 ? endpoint.tags : ['default'];

    for (const tag of tags) {
      const group = groups.get(tag);
      if (group) {
        group.push(endpoint);
      } else {
        groups.set(tag, [endpoint]);
      }
    }
  }

  return groups;
}

export function groupEndpointsByPath(endpoints: Endpoint[]): Map<string, Endpoint[]> {
  const groups = new Map<string, Endpoint[]>();

  for (const endpoint of endpoints) {
    const basePath = endpoint.path.replace(/\{.*?\}/g, '{id}');

    const group = groups.get(basePath);
    if (group) {
      group.push(endpoint);
    } else {
      groups.set(basePath, [endpoint]);
    }
  }

  return groups;
}

export function sortEndpoints(endpoints: Endpoint[]): Endpoint[] {
  return [...endpoints].sort((a, b) => {
    if (a.path !== b.path) {
      return a.path.localeCompare(b.path);
    }
    return a.method.localeCompare(b.method);
  });
}

export function getAllTags(endpoints: Endpoint[]): string[] {
  const tagSet = new Set<string>();

  for (const endpoint of endpoints) {
    for (const tag of endpoint.tags) {
      tagSet.add(tag);
    }
  }

  return Array.from(tagSet).sort();
}

export function hasRequiredParameters(endpoint: Endpoint): boolean {
  return endpoint.parameters.some((param) => param.required === true);
}

export function hasRequestBody(endpoint: Endpoint): boolean {
  return endpoint.requestBody !== undefined;
}

export function getStatusCodes(responses: ResponsesObject): string[] {
  return Object.keys(responses).sort((a, b) => {
    const aIsSuccess = a.startsWith('2');
    const bIsSuccess = b.startsWith('2');
    if (aIsSuccess && !bIsSuccess) return -1;
    if (!aIsSuccess && bIsSuccess) return 1;
    return parseInt(a) - parseInt(b);
  });
}

function resolveResponseSchemas(
  response: ResponseObject,
  components?: ComponentsObject
): ResponseObject {
  if (!response.content) return response;

  const resolvedContent: Record<string, MediaTypeObject> = {};
  for (const [mediaType, mediaObject] of Object.entries(response.content)) {
    resolvedContent[mediaType] = {
      ...mediaObject,
      schema: mediaObject.schema ? resolveSchemaDeep(mediaObject.schema, components) : undefined,
    };
  }

  return {
    ...response,
    content: resolvedContent,
  };
}

function resolveRequestBodySchemas(
  requestBody: RequestBodyObject,
  components?: ComponentsObject
): RequestBodyObject {
  if (!requestBody.content) return requestBody;

  const resolvedContent: Record<string, MediaTypeObject> = {};
  for (const [mediaType, mediaObject] of Object.entries(requestBody.content)) {
    resolvedContent[mediaType] = {
      ...mediaObject,
      schema: mediaObject.schema ? resolveSchemaDeep(mediaObject.schema, components) : undefined,
    };
  }

  return {
    ...requestBody,
    content: resolvedContent,
  };
}
