// // Захардкоженная OpenAPI схема для разработки
// export const MOCK_SCHEMA_YAML = `
// openapi: 3.0.0
// info:
//   title: Test API
//   version: 1.0.0
// paths:
//   /users:
//     get:
//       summary: Get all users
//       tags: [Users]
//       responses:
//         '200':
//           description: OK
//           content:
//             application/json:
//               schema:
//                 type: array
//                 items:
//                   type: object
//                   properties:
//                     id: { type: integer }
//                     name: { type: string }
//   /users/{id}:
//     get:
//       summary: Get user by ID
//       tags: [Users]
//       parameters:
//         - name: id
//           in: path
//           required: true
//           schema: { type: integer }
//       responses:
//         '200':
//           description: OK
// `;

// export const MOCK_SCHEMA_JSON = {
//   openapi: '3.0.0',
//   info: { title: 'Test API', version: '1.0.0' },
//   paths: {
//     '/users': {
//       get: {
//         summary: 'Get all users',
//         tags: ['Users'],
//         responses: {
//           '200': {
//             description: 'OK'
//           }
//         }
//       }
//     }
//   }
// };

// src/mocks/swaggerSchema.ts

export const MOCK_SCHEMA_YAML = `
openapi: 3.1.0
info:
  title: Test API
  version: 1.0.0
  description: API для тестирования Swagger Viewer

paths:
  /users:
    get:
      summary: Get all users
      description: Возвращает список всех пользователей
      tags:
        - Users
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    id:
                      type: integer
                    name:
                      type: string
                    email:
                      type: string

  /users/{id}:
    get:
      summary: Get user by ID
      description: Возвращает пользователя по ID
      tags:
        - Users
      parameters:
        - name: id
          in: path
          required: true
          description: ID пользователя
          schema:
            type: integer
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: object
                properties:
                  id:
                    type: integer
                  name:
                    type: string
                  email:
                    type: string
        '404':
          description: User not found

  /products:
    get:
      summary: Get all products
      tags:
        - Products
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    id:
                      type: integer
                    name:
                      type: string
                    price:
                      type: number
`;

export const MOCK_SCHEMA_JSON = {
  openapi: '3.1.0',
  info: {
    title: 'Test API',
    version: '1.0.0',
    description: 'API для тестирования Swagger Viewer',
  },
  paths: {
    '/users': {
      get: {
        summary: 'Get all users',
        description: 'Возвращает список всех пользователей',
        tags: ['Users'],
        responses: {
          '200': {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'integer' },
                      name: { type: 'string' },
                      email: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/users/{id}': {
      get: {
        summary: 'Get user by ID',
        description: 'Возвращает пользователя по ID',
        tags: ['Users'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID пользователя',
            schema: { type: 'integer' },
          },
        ],
        responses: {
          '200': {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer' },
                    name: { type: 'string' },
                    email: { type: 'string' },
                  },
                },
              },
            },
          },
          '404': {
            description: 'User not found',
          },
        },
      },
    },
    '/products': {
      get: {
        summary: 'Get all products',
        tags: ['Products'],
        responses: {
          '200': {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'integer' },
                      name: { type: 'string' },
                      price: { type: 'number' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};