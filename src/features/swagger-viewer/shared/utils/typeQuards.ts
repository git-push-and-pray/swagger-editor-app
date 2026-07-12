import type {
  MediaTypeObject,
  OpenAPIObject,
  OperationObject,
  ResponseObject,
} from 'openapi-types-v3.1.0';

export function isValidResponse(response: unknown): response is ResponseObject {
  if (typeof response !== 'object' || response === null) {
    return false;
  }
  return 'description' in response && typeof response.description === 'string';
}

export function isValidMediaObject(obj: unknown): obj is MediaTypeObject {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }
  return true;
}

export function isOperationObject(obj: unknown): obj is OperationObject {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  const maybeOp = obj as Record<string, unknown>;
  return typeof maybeOp.responses === 'object' && maybeOp.responses !== null;
}

export function isValidOpenAPIObject(obj: unknown): obj is OpenAPIObject {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  const maybeOpenAPI = obj as Record<string, unknown>;
  if (typeof maybeOpenAPI.openapi !== 'string') {
    return false;
  }

  if (!maybeOpenAPI.openapi.startsWith('3.')) {
    return false;
  }

  if (typeof maybeOpenAPI.paths !== 'object' || maybeOpenAPI.paths === null) {
    return false;
  }

  return true;
}
