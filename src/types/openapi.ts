import type {
  CallbackObject,
  ComponentsObject,
  ContactObject,
  DiscriminatorObject,
  EncodingObject,
  ExampleObject,
  ExternalDocumentationObject,
  HeaderObject,
  InfoObject,
  LicenseObject,
  LinkObject,
  MediaTypeObject,
  OAuthFlowObject,
  OAuthFlowsObject,
  OpenAPIObject,
  OperationObject,
  ParameterObject,
  PathItemObject,
  PathsObject,
  ReferenceObject,
  RequestBodyObject,
  ResponseObject,
  ResponsesObject,
  SchemaObject,
  SecurityRequirementObject,
  SecuritySchemeObject,
  ServerObject,
  ServerVariableObject,
  TagObject,
  XMLObject,
} from 'openapi-types-v3.1.0';

export type {
  CallbackObject,
  ComponentsObject,
  ContactObject,
  DiscriminatorObject,
  EncodingObject,
  ExampleObject,
  ExternalDocumentationObject,
  HeaderObject,
  InfoObject,
  LicenseObject,
  LinkObject,
  MediaTypeObject,
  OAuthFlowObject,
  OAuthFlowsObject,
  OpenAPIObject,
  OperationObject,
  ParameterObject,
  PathItemObject,
  PathsObject,
  ReferenceObject,
  RequestBodyObject,
  ResponseObject,
  ResponsesObject,
  SchemaObject,
  SecurityRequirementObject,
  SecuritySchemeObject,
  ServerObject,
  ServerVariableObject,
  TagObject,
  XMLObject,
};

export interface Endpoint {
  method: HttpMethod;
  path: string;
  summary?: string;
  description?: string;
  operationId?: string;
  tags: string[];
  parameters: ParameterObject[];
  requestBody?: RequestBodyObject;
  responses: ResponsesObject;
  security?: SecurityRequirementObject[];
  servers?: ServerObject[];
  deprecated?: boolean;
  externalDocs?: ExternalDocumentationObject;
}

export interface EndpointGroup {
  tag: string;
  endpoints: Endpoint[];
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS' | 'TRACE';

export type ParameterLocation = 'query' | 'header' | 'path' | 'cookie';

export type SecuritySchemeType = 'apiKey' | 'http' | 'oauth2' | 'openIdConnect';

export type SchemaFormat = 'json' | 'yaml';

export interface ParseResult {
  schema: OpenAPIObject | null;
  format: SchemaFormat;
  errors?: string[];
}

export interface ProxyRequest {
  url: string;
  method: HttpMethod;
  headers: Record<string, string>;
  body?: unknown;
  params?: Record<string, unknown>;
}

export interface ProxyResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  duration: number;
  error?: string;
}

export interface RequestHistory {
  id: string;
  timestamp: Date | string;
  endpoint: string;
  method: HttpMethod;
  status: number;
  duration: number;
  requestSize: number;
  responseSize: number;
  url: string;
  errorDetails?: string;
  userId: string;
}

export interface TryItOutState {
  isExecuting: boolean;
  response: ProxyResponse | null;
  error: string | null;
  parameters: Record<string, unknown>;
  headers: Record<string, string>;
  body: unknown;
}

export interface ViewerState {
  endpoints: Endpoint[];
  groups: EndpointGroup[];
  selectedEndpoint: Endpoint | null;
  expandedGroups: string[];
  searchQuery: string;
}

export type MethodWithOperation = {
  method: HttpMethod;
  operation: OperationObject;
};

export type PathWithMethods = {
  path: string;
  methods: MethodWithOperation[];
};

export type ValidatedSchema = {
  isValid: boolean;
  schema?: OpenAPIObject;
  errors?: string[];
  warnings?: string[];
};

// хелпер для параметра pathItem с возмжной ссылкой (обрабатывает ситуации, когда параметр не просто объект - добавлено чтобы тс не ругалсяя)
// https://spec.openapis.org/oas/v3.2.0.html#path-item-object-example
export type ParameterOrReference = ParameterObject | ReferenceObject;

export function isReferenceObject(obj: unknown): obj is ReferenceObject {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  const maybeRef = obj as Record<string, unknown>;
  return typeof maybeRef.$ref === 'string';
}

export function resolveParameter(
  param: ParameterOrReference,
  components?: ComponentsObject
): ParameterObject {
  if (isReferenceObject(param)) {
    if (!components?.parameters) {
      throw new Error(`Не удалось найти параметр по ссылке: ${param.$ref}`);
    }

    const refPath = param.$ref.split('/');
    const paramName = refPath[refPath.length - 1];

    const resolvedParam = components.parameters[paramName];
    if (!resolvedParam) {
      throw new Error(`Параметр "${paramName}" не найден в components.parameters`);
    }
    return resolveParameter(resolvedParam, components);
  }
  return param;
}

export function resolveParameters(
  params: ParameterOrReference[] | undefined,
  components?: ComponentsObject
): ParameterObject[] {
  if (!params || params.length === 0) {
    return [];
  }

  return params.map((param) => resolveParameter(param, components));
}

// хелпер для ТЕЛА запроса с возмжной ссылкой (обрабатывает ситуации, когда тело запроса не просто объект - тоже добавлено чтобы тс не ругалсяя)
//https://spec.openapis.org/oas/v3.2.0.html#request-body-examples
export type RequestBodyOrReference = RequestBodyObject | ReferenceObject;

export function resolveRequestBody(
  body: RequestBodyOrReference,
  components?: ComponentsObject
): RequestBodyObject {
  if (isReferenceObject(body)) {
    if (!components?.requestBodies) {
      throw new Error(`Не удалось найти requestBody по ссылке: ${body.$ref}`);
    }

    const refPath = body.$ref.split('/');
    const bodyName = refPath[refPath.length - 1];

    const resolvedBody = components.requestBodies[bodyName];
    if (!resolvedBody) {
      throw new Error(`requestBody "${bodyName}" не найден в components.requestBodies`);
    }

    return resolveRequestBody(resolvedBody, components);
  }

  return body;
}

export function resolveResponse(
  response: ResponseObject | ReferenceObject,
  components?: ComponentsObject
): ResponseObject {
  if (isReferenceObject(response)) {
    if (!components?.responses) {
      throw new Error(`Не удалось найти response по ссылке: ${response.$ref}`);
    }

    const refPath = response.$ref.split('/');
    const responseName = refPath[refPath.length - 1];

    const resolvedResponse = components.responses[responseName];
    if (!resolvedResponse) {
      throw new Error(`response "${responseName}" не найден в components.responses`);
    }

    return resolveResponse(resolvedResponse, components);
  }

  return response;
}

export function resolveSchema(
  schema: SchemaObject | ReferenceObject,
  components?: ComponentsObject
): SchemaObject {
  if (isReferenceObject(schema)) {
    if (!components?.schemas) {
      throw new Error(`Не удалось найти schema по ссылке: ${schema.$ref}`);
    }

    const refPath = schema.$ref.split('/');
    const schemaName = refPath[refPath.length - 1];

    const resolvedSchema = components.schemas[schemaName];
    if (!resolvedSchema) {
      throw new Error(`schema "${schemaName}" не найден в components.schemas`);
    }

    return resolveSchema(resolvedSchema, components);
  }

  return schema;
}
