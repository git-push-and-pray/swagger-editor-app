export const VALID_DOCUMENT = {
  openapi: '3.0.0',
  info: {
    title: 'Test API',
    version: '1.0.0',
  },
  paths: {},
};

export const VALID_JSON = JSON.stringify(VALID_DOCUMENT, null, 2);

export const VALID_YAML = `openapi: 3.0.0
info:
  title: Test API
  version: 1.0.0
paths: {}
`;

export const INVALID_YAML = `openapi: 3.0.0
info: [
`;

export const INVALID_OPENAPI = `openapi: 3.0.0
info:
  title: Test API
paths: {}
`;
