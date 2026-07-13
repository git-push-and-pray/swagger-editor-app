import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { Endpoint } from '@/types/openapi';

import EndpointDetails from '../EndpointDetails';

vi.mock('@/features/auth/hooks/useAuth', () => ({
  useAuth: vi.fn(() => ({ user: null })),
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      deprecated: 'Deprecated',
      closeDetails: 'Close details',
    };
    return translations[key] || key;
  },
}));

vi.mock('../TryItOut/TryItOut', () => ({
  default: ({ endpoint }: { endpoint: Endpoint }) => (
    <div data-testid="try-it-out">TryItOut for {endpoint.path}</div>
  ),
}));

vi.mock('./ParametersSection', () => ({
  default: ({ parameters }: { parameters: unknown[] }) => (
    <div data-testid="parameters-section">Parameters ({parameters.length})</div>
  ),
}));

vi.mock('./RequestBodySection', () => ({
  default: () => <div data-testid="request-body-section">Request Body</div>,
}));

vi.mock('./ResponsesSection', () => ({
  default: ({ responses }: { responses: Record<string, unknown> }) => (
    <div data-testid="responses-section">Responses ({Object.keys(responses).length})</div>
  ),
}));

vi.mock('@/components/ui/MethodBadge', () => ({
  default: ({ method }: { method: string }) => <span data-testid="method-badge">{method}</span>,
}));

describe('EndpointDetails', () => {
  const mockOnClose = vi.fn();

  const mockEndpoint: Endpoint = {
    method: 'GET',
    path: '/users/{id}',
    summary: 'Get user by ID',
    description: 'Returns a single user by their unique identifier',
    tags: ['Users'],
    parameters: [
      {
        name: 'id',
        in: 'path',
        required: true,
        schema: { type: 'integer' },
        description: 'User ID',
      },
      {
        name: 'limit',
        in: 'query',
        schema: { type: 'integer' },
      },
    ],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              name: { type: 'string' },
            },
          },
        },
      },
    },
    responses: {
      '200': { description: 'OK' },
      '404': { description: 'Not Found' },
    },
    deprecated: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render endpoint method and path', () => {
      render(<EndpointDetails endpoint={mockEndpoint} onClose={mockOnClose} />);

      expect(screen.getByTestId('method-badge')).toHaveTextContent('GET');
      expect(screen.getByText('/users/{id}')).toBeInTheDocument();
    });

    it('should render TryItOut component', () => {
      render(<EndpointDetails endpoint={mockEndpoint} onClose={mockOnClose} />);

      expect(screen.getByTestId('try-it-out')).toHaveTextContent('TryItOut for /users/{id}');
    });

    it('should render summary and description when provided', () => {
      render(<EndpointDetails endpoint={mockEndpoint} onClose={mockOnClose} />);

      expect(screen.getByText('Get user by ID')).toBeInTheDocument();
      expect(
        screen.getByText('Returns a single user by their unique identifier')
      ).toBeInTheDocument();
    });

    it('should not render description when not provided', () => {
      const endpointWithoutDescription: Endpoint = {
        ...mockEndpoint,
        description: undefined,
      };

      render(<EndpointDetails endpoint={endpointWithoutDescription} onClose={mockOnClose} />);

      expect(screen.getByText('Get user by ID')).toBeInTheDocument();

      const paragraphs = screen.getAllByText(/Get user by ID|Returns a single user/);
      expect(paragraphs).toHaveLength(1);
    });

    it('should render deprecated badge when endpoint is deprecated', () => {
      const deprecatedEndpoint: Endpoint = {
        ...mockEndpoint,
        deprecated: true,
      };

      render(<EndpointDetails endpoint={deprecatedEndpoint} onClose={mockOnClose} />);

      expect(screen.getByText('Deprecated')).toBeInTheDocument();
    });

    it('should not render deprecated badge when endpoint is not deprecated', () => {
      render(<EndpointDetails endpoint={mockEndpoint} onClose={mockOnClose} />);

      expect(screen.queryByText('Deprecated')).not.toBeInTheDocument();
    });

    it('should not render ParametersSection when parameters array is empty', () => {
      const endpointWithoutParams: Endpoint = {
        ...mockEndpoint,
        parameters: [],
      };

      render(<EndpointDetails endpoint={endpointWithoutParams} onClose={mockOnClose} />);

      expect(screen.queryByTestId('parameters-section')).not.toBeInTheDocument();
    });

    it('should not render RequestBodySection when requestBody is undefined', () => {
      const endpointWithoutBody: Endpoint = {
        ...mockEndpoint,
        requestBody: undefined,
      };

      render(<EndpointDetails endpoint={endpointWithoutBody} onClose={mockOnClose} />);

      expect(screen.queryByTestId('request-body-section')).not.toBeInTheDocument();
    });

    it('should not render ResponsesSection when responses are empty', () => {
      const endpointWithoutResponses: Endpoint = {
        ...mockEndpoint,
        responses: {},
      };

      render(<EndpointDetails endpoint={endpointWithoutResponses} onClose={mockOnClose} />);

      expect(screen.queryByTestId('responses-section')).not.toBeInTheDocument();
    });
  });

  describe('close button', () => {
    it('should call onClose when close button is clicked', () => {
      render(<EndpointDetails endpoint={mockEndpoint} onClose={mockOnClose} />);

      const closeButton = screen.getByText('✕');
      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should have aria-label for accessibility', () => {
      render(<EndpointDetails endpoint={mockEndpoint} onClose={mockOnClose} />);

      const closeButton = screen.getByText('✕');
      expect(closeButton).toHaveAttribute('aria-label', 'Close details');
    });
  });

  describe('scrolling', () => {
    it('should have scrollable container when content overflows', () => {
      const { container } = render(
        <EndpointDetails endpoint={mockEndpoint} onClose={mockOnClose} />
      );

      const detailsContainer = container.firstChild as HTMLElement;
      expect(detailsContainer).toHaveClass('max-h-100', 'overflow-y-auto');
    });
  });

  describe('edge cases', () => {
    it('should handle endpoint with empty tags', () => {
      const endpointWithEmptyTags: Endpoint = {
        ...mockEndpoint,
        tags: [],
      };

      render(<EndpointDetails endpoint={endpointWithEmptyTags} onClose={mockOnClose} />);

      expect(screen.getByText('/users/{id}')).toBeInTheDocument();
    });

    it('should handle summary without description', () => {
      const endpointWithSummaryOnly: Endpoint = {
        ...mockEndpoint,
        summary: 'Get user',
        description: undefined,
      };

      render(<EndpointDetails endpoint={endpointWithSummaryOnly} onClose={mockOnClose} />);

      expect(screen.getByText('Get user')).toBeInTheDocument();
      expect(screen.queryByText(/Returns a single user/)).not.toBeInTheDocument();
    });

    it('should handle description without summary', () => {
      const endpointWithDescriptionOnly: Endpoint = {
        ...mockEndpoint,
        summary: undefined,
        description: 'Returns a user',
      };

      render(<EndpointDetails endpoint={endpointWithDescriptionOnly} onClose={mockOnClose} />);

      expect(screen.queryByText('Get user by ID')).not.toBeInTheDocument();
      expect(screen.getByText('Returns a user')).toBeInTheDocument();
    });
  });
});
