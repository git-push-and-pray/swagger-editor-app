import { render, screen } from '@testing-library/react';
import type { OpenAPI } from 'openapi-types';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SwaggerViewer } from '../../Viewer';

vi.mock('next-intl', () => ({
  useTranslations: vi.fn(() => (key: string) => {
    const translations: Record<string, string> = {
      'waiting.title': '⏳ Waiting for schema',
      'waiting.description': 'Schema not loaded or not entered yet',
      'noEndpoints.title': '📭 No endpoints',
      'noEndpoints.description': 'No endpoints (paths) described in the schema',
      noEndpointsToDisplay: 'No endpoints to display',
      defaultTag: 'General',
      parametersCount: 'parameters',
      deprecated: 'Deprecated',
      body: 'body',
    };
    return translations[key] || key;
  }),
  useLocale: vi.fn(() => 'en'),
  useFormatter: vi.fn(() => ({
    dateTime: vi.fn(),
    number: vi.fn(),
  })),
}));

vi.mock('./components/ViewerHeader', () => ({
  ViewerHeader: ({ endpointsCount }: { endpointsCount: number }) => (
    <div data-testid="viewer-header">Viewer Header ({endpointsCount})</div>
  ),
}));

vi.mock('./components/EndpointDetails', () => ({
  default: ({ endpoint, onClose }: { endpoint: { path: string }; onClose: () => void }) => (
    <div data-testid="endpoint-details">
      Details for {endpoint.path}
      <button onClick={onClose} data-testid="close-details-btn">
        Close
      </button>
    </div>
  ),
}));

vi.mock('./services/endpointExtractor', () => ({
  extractEndpoints: vi.fn((doc: OpenAPI.Document | null) => {
    if (!doc?.paths) return [];

    const endpoints: Array<{
      method: string;
      path: string;
      summary: string;
      tags: string[];
      parameters: unknown[];
      requestBody: unknown;
      responses: unknown;
      deprecated: boolean;
    }> = [];

    for (const [path, pathItem] of Object.entries(doc.paths)) {
      const item = pathItem as Record<string, unknown>;

      if (item.get) {
        const getOp = item.get as { summary?: string; tags?: string[] };
        endpoints.push({
          method: 'GET',
          path,
          summary: getOp.summary || '',
          tags: getOp.tags || [],
          parameters: [],
          requestBody: undefined,
          responses: {},
          deprecated: false,
        });
      }

      if (item.post) {
        const postOp = item.post as { summary?: string; tags?: string[] };
        endpoints.push({
          method: 'POST',
          path,
          summary: postOp.summary || '',
          tags: postOp.tags || [],
          parameters: [],
          requestBody: { required: true, content: {} },
          responses: {},
          deprecated: false,
        });
      }

      if (item.put) {
        const putOp = item.put as { summary?: string; tags?: string[] };
        endpoints.push({
          method: 'PUT',
          path,
          summary: putOp.summary || '',
          tags: putOp.tags || [],
          parameters: [],
          requestBody: { required: true, content: {} },
          responses: {},
          deprecated: false,
        });
      }

      if (item.delete) {
        const deleteOp = item.delete as { summary?: string; tags?: string[] };
        endpoints.push({
          method: 'DELETE',
          path,
          summary: deleteOp.summary || '',
          tags: deleteOp.tags || [],
          parameters: [],
          requestBody: undefined,
          responses: {},
          deprecated: false,
        });
      }
    }

    return endpoints;
  }),

  groupEndpointsByTag: vi.fn((endpoints: Array<{ tags: string[] }>) => {
    const groups = new Map<string, Array<{ tags: string[] }>>();
    for (const endpoint of endpoints) {
      const tags = endpoint.tags.length > 0 ? endpoint.tags : ['default'];
      for (const tag of tags) {
        if (!groups.has(tag)) {
          groups.set(tag, []);
        }
        groups.get(tag)?.push(endpoint);
      }
    }
    return groups;
  }),

  sortEndpoints: vi.fn((endpoints: unknown[]) => endpoints),
}));

vi.mock('@/components/ui/MethodBadge', () => ({
  default: ({ method }: { method: string }) => <span data-testid="method-badge">{method}</span>,
}));

describe('SwaggerViewer', () => {
  const mockDocument: OpenAPI.Document = {
    openapi: '3.0.0',
    info: { title: 'Test API', version: '1.0.0' },
    paths: {
      '/users': {
        get: {
          summary: 'Get users',
          tags: ['Users'],
          responses: {
            '200': { description: 'OK' },
          },
        },
      },
      '/products': {
        get: {
          summary: 'Get products',
          tags: ['Products'],
          responses: {
            '200': { description: 'OK' },
          },
        },
        post: {
          summary: 'Create product',
          tags: ['Products'],
          responses: {
            '201': { description: 'Created' },
          },
        },
      },
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering with document', () => {
    it('should render endpoint summary when available', () => {
      render(<SwaggerViewer document={mockDocument} />);

      expect(screen.getByText('Get users')).toBeInTheDocument();
      expect(screen.getByText('Get products')).toBeInTheDocument();
      expect(screen.getByText('Create product')).toBeInTheDocument();
    });

    it('should show parameters count when endpoint has parameters', () => {
      const docWithParams: OpenAPI.Document = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {
          '/users/{id}': {
            get: {
              summary: 'Get user by ID',
              tags: ['Users'],
              parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
              responses: {
                '200': { description: 'OK' },
              },
            },
          },
        },
      };

      render(<SwaggerViewer document={docWithParams} />);

      expect(screen.getByText('parameters: 1')).toBeInTheDocument();
    });

    it('should show default tag for endpoints without tags', () => {
      const docWithoutTags: OpenAPI.Document = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {
          '/health': {
            get: {
              summary: 'Health check',
              responses: {
                '200': { description: 'OK' },
              },
            },
          },
        },
      };

      render(<SwaggerViewer document={docWithoutTags} />);

      expect(screen.getByText('General')).toBeInTheDocument();
    });
  });

  describe('styling and layout', () => {
    it('should have scrollable container for endpoints list', () => {
      const { container } = render(<SwaggerViewer document={mockDocument} />);

      const scrollContainer = container.querySelector('.overflow-y-auto');
      expect(scrollContainer).toBeInTheDocument();
      expect(scrollContainer).toHaveClass('overflow-y-auto', 'scroll-smooth');
    });
  });

  describe('edge cases', () => {
    it('should handle endpoints with both GET and POST methods', () => {
      const docWithBoth: OpenAPI.Document = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {
          '/items': {
            get: {
              summary: 'Get items',
              tags: ['Items'],
              responses: { '200': { description: 'OK' } },
            },
            post: {
              summary: 'Create item',
              tags: ['Items'],
              responses: { '201': { description: 'Created' } },
            },
          },
        },
      };

      render(<SwaggerViewer document={docWithBoth} />);

      const badges = screen.getAllByTestId('method-badge');
      expect(badges).toHaveLength(2);
      expect(badges[0]).toHaveTextContent('GET');
      expect(badges[1]).toHaveTextContent('POST');
    });

    it('should handle endpoint with long path name', () => {
      const docWithLongPath: OpenAPI.Document = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {
          '/api/v1/users/{userId}/posts/{postId}/comments': {
            get: {
              summary: 'Get comments',
              tags: ['Comments'],
              responses: { '200': { description: 'OK' } },
            },
          },
        },
      };

      render(<SwaggerViewer document={docWithLongPath} />);

      expect(
        screen.getByText('/api/v1/users/{userId}/posts/{postId}/comments')
      ).toBeInTheDocument();
    });
  });
});
