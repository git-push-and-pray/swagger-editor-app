// src/types/openapi.ts

// ============================================
// 1. ИМПОРТ ВСЕХ ТИПОВ ИЗ ПАКЕТА
// ============================================

// Основные типы
import type {
  // === Базовые объекты ===
  OpenAPIObject,           // Полная OpenAPI спецификация
  InfoObject,              // Информация об API (title, version, description)
  ContactObject,           // Контактная информация
  LicenseObject,           // Информация о лицензии
  ServerObject,            // Сервер (url, description, variables)
  ServerVariableObject,    // Переменные сервера

  // === Пути и операции ===
  PathsObject,             // Объект со всеми путями
  PathItemObject,          // Один путь (с методами)
  OperationObject,         // Операция (GET, POST и т.д.)

  // === Параметры ===
  ParameterObject,         // Параметр (path, query, header, cookie)

  // === Request Body ===
  RequestBodyObject,       // Тело запроса
  MediaTypeObject,         // Медиа-тип (application/json и т.д.)
  ContentObject,           // Объект content { 'application/json': MediaTypeObject }
  EncodingObject,          // Кодирование для form-data

  // === Responses ===
  ResponsesObject,         // Объект со всеми ответами
  ResponseObject,          // Один ответ
  HeaderObject,            // Заголовок в ответе

  // === Schemas ===
  SchemaObject,            // Схема данных
  ReferenceObject,         // Ссылка ($ref)

  // === Components ===
  ComponentsObject,        // Объект components (schemas, parameters, responses, etc.)

  // === Security ===
  SecurityRequirementObject, // Требования безопасности
  SecuritySchemeObject,    // Схема безопасности

  // === Примеры ===
  ExampleObject,           // Пример
  ExamplesObject,          // Объект с примерами

  // === Дополнительно ===
  TagObject,               // Тег для группировки
  ExternalDocumentationObject, // Внешняя документация
  OAuthFlowObject,         // OAuth поток
  OAuthFlowsObject,        // OAuth потоки
  LinkObject,              // Ссылка
  CallbackObject,          // Callback
  DiscriminatorObject,     // Дискриминатор для oneOf/anyOf
  XMLObject,               // XML опции
  OperationIdObject,       // Operation ID
  OpenApiVersion,          // Версия OpenAPI ('3.1.0')
} from 'openapi-types-v3.1.0';

// ============================================
// 2. ЭКСПОРТ ВСЕХ ТИПОВ (чтобы не импортировать из пакета напрямую)
// ============================================

export type {
  // Основные
  OpenAPIObject,
  InfoObject,
  ContactObject,
  LicenseObject,
  ServerObject,
  ServerVariableObject,

  // Пути и операции
  PathsObject,
  PathItemObject,
  OperationObject,

  // Параметры
  ParameterObject,

  // Request Body
  RequestBodyObject,
  MediaTypeObject,
  ContentObject,
  EncodingObject,

  // Responses
  ResponsesObject,
  ResponseObject,
  HeaderObject,

  // Schemas
  SchemaObject,
  ReferenceObject,

  // Components
  ComponentsObject,

  // Security
  SecurityRequirementObject,
  SecuritySchemeObject,

  // Примеры
  ExampleObject,
  ExamplesObject,

  // Дополнительно
  TagObject,
  ExternalDocumentationObject,
  OAuthFlowObject,
  OAuthFlowsObject,
  LinkObject,
  CallbackObject,
  DiscriminatorObject,
  XMLObject,
  OperationIdObject,
  OpenApiVersion,
};

// ============================================
// 3. СВОИ ТИПЫ (которых нет в пакете)
// ============================================

/**
 * Эндпоинт - результат экстракции из OpenAPI схемы
 * Используется для отображения в Viewer
 */
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

/**
 * Группа эндпоинтов (по тегам)
 * Используется для группировки в списке
 */
export interface EndpointGroup {
  tag: string;
  endpoints: Endpoint[];
}

/**
 * HTTP методы
 */
export type HttpMethod = 
  | 'GET' 
  | 'POST' 
  | 'PUT' 
  | 'DELETE' 
  | 'PATCH' 
  | 'HEAD' 
  | 'OPTIONS' 
  | 'TRACE';

/**
 * Тип параметра (in)
 */
export type ParameterLocation = 'query' | 'header' | 'path' | 'cookie';

/**
 * Тип схемы безопасности
 */
export type SecuritySchemeType = 'apiKey' | 'http' | 'oauth2' | 'openIdConnect';

/**
 * Формат для парсинга
 */
export type SchemaFormat = 'json' | 'yaml';

/**
 * Результат парсинга
 */
export interface ParseResult {
  schema: OpenAPIObject;
  format: SchemaFormat;
  errors?: string[];
}

/**
 * Данные для прокси-запроса
 */
export interface ProxyRequest {
  url: string;
  method: HttpMethod;
  headers: Record<string, string>;
  body?: any;
  params?: Record<string, any>;
}

/**
 * Результат выполнения запроса через прокси
 */
export interface ProxyResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  duration: number;
  error?: string;
}

/**
 * История запроса (для Feature 5)
 */
export interface RequestHistory {
  id: string;
  timestamp: Date;
  endpoint: string;
  method: HttpMethod;
  status: number;
  duration: number;
  requestSize: number;
  responseSize: number;
  url: string;
  errorDetails?: string;
  userId?: string;
}

// ============================================
// 4. ВСПОМОГАТЕЛЬНЫЕ ТИПЫ ДЛЯ UI
// ============================================

/**
 * Состояние Try-It-Out
 */
export interface TryItOutState {
  isExecuting: boolean;
  response: ProxyResponse | null;
  error: string | null;
  parameters: Record<string, any>;
  headers: Record<string, string>;
  body: any;
}

/**
 * Состояние Viewer
 */
export interface ViewerState {
  endpoints: Endpoint[];
  groups: EndpointGroup[];
  selectedEndpoint: Endpoint | null;
  expandedGroups: string[];
  searchQuery: string;
}

// ============================================
// 5. АЛИАСЫ ДЛЯ УДОБСТВА
// ============================================

/**
 * Тип для метода с HTTP методом
 */
export type MethodWithOperation = {
  method: HttpMethod;
  operation: OperationObject;
};

/**
 * Тип для пути с методами
 */
export type PathWithMethods = {
  path: string;
  methods: MethodWithOperation[];
};

/**
 * Тип для схемы после валидации
 */
export type ValidatedSchema = {
  isValid: boolean;
  schema?: OpenAPIObject;
  errors?: string[];
  warnings?: string[];
};