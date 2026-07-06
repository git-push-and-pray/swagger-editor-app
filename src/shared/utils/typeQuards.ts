import type { MediaTypeObject, ResponseObject } from 'openapi-types-v3.1.0';

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
