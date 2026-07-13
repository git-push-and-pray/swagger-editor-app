import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { Endpoint, ProxyResponse } from '@/types/openapi';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'tryItOut.button': 'Try it out',
      'tryItOut.cancel': 'Cancel',
      'tryItOut.title': 'Try It Out',
      'tryItOut.headers': 'Headers',
      'tryItOut.execute': 'Execute',
      'tryItOut.executing': 'Executing...',
      'tryItOut.generateCurl': 'Generate cURL',
      'tryItOut.copied': 'cURL command copied to clipboard!',
      'tryItOut.placeholder': 'Content-Type: application/json',
      saveHistoryError: 'Failed to save request history',
    };
    return translations[key] || key;
  },
}));

vi.mock('@/features/auth/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

vi.mock('@/features/history/services/saveRequestHistory', () => ({
  saveRequestHistory: vi.fn(),
}));

vi.mock('../../services/proxyService', () => ({
  sendRequest: vi.fn(),
}));

vi.mock('../../services/curlGenerator', () => ({
  generateCurl: vi.fn(() => 'curl -X GET "https://api.example.com/users"'),
}));

vi.mock('../../shared/utils/formatResponseBody', () => ({
  formatResponseBody: vi.fn((body) => body),
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(() => Promise.resolve()),
  },
});

import { toast } from 'sonner';

import { useAuth } from '@/features/auth/hooks/useAuth';
import { saveRequestHistory } from '@/features/history/services/saveRequestHistory';

import { sendRequest } from '../../services/proxyService';
import TryItOut from '../TryItOut/TryItOut';

describe('TryItOut', () => {
  const mockEndpoint: Endpoint = {
    method: 'GET',
    path: '/users',
    summary: 'Get all users',
    tags: ['Users'],
    parameters: [
      {
        name: 'id',
        in: 'path',
        required: true,
        schema: { type: 'integer' },
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
    servers: [{ url: 'https://api.example.com/v1' }],
  };

  const mockResponse: ProxyResponse = {
    status: 200,
    statusText: 'OK',
    headers: { 'content-type': 'application/json' },
    body: '{"data": "success"}',
    duration: 150,
  };

  const mockUser = { id: 'user-123', email: 'test@example.com' };

  beforeEach(() => {
    vi.clearAllMocks();

    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({ user: null });
    (sendRequest as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);
    (saveRequestHistory as ReturnType<typeof vi.fn>).mockResolvedValue({ success: true });
    (navigator.clipboard.writeText as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
  });

  describe('rendering', () => {
    it('should render "Try it out" button initially', () => {
      render(<TryItOut endpoint={mockEndpoint} />);

      expect(screen.getByText('Try it out')).toBeInTheDocument();
    });

    it('should toggle to "Cancel" when clicked', () => {
      render(<TryItOut endpoint={mockEndpoint} />);

      const button = screen.getByText('Try it out');
      fireEvent.click(button);

      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('should show TryItOut panel when button is clicked', () => {
      render(<TryItOut endpoint={mockEndpoint} />);

      fireEvent.click(screen.getByText('Try it out'));

      expect(screen.getByText('Try It Out')).toBeInTheDocument();
      expect(screen.getByText('Headers')).toBeInTheDocument();
    });

    it('should hide panel when Cancel is clicked', () => {
      render(<TryItOut endpoint={mockEndpoint} />);

      fireEvent.click(screen.getByText('Try it out'));
      expect(screen.getByText('Try It Out')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Cancel'));
      expect(screen.queryByText('Try It Out')).not.toBeInTheDocument();
    });

    it('should not show ParameterInputs when endpoint has no parameters', () => {
      const endpointWithoutParams: Endpoint = {
        ...mockEndpoint,
        parameters: [],
      };

      render(<TryItOut endpoint={endpointWithoutParams} />);

      fireEvent.click(screen.getByText('Try it out'));

      expect(screen.queryByText('Parameters')).not.toBeInTheDocument();
    });

    it('should not show BodyEditor when endpoint has no requestBody', () => {
      const endpointWithoutBody: Endpoint = {
        ...mockEndpoint,
        requestBody: undefined,
      };

      render(<TryItOut endpoint={endpointWithoutBody} />);

      fireEvent.click(screen.getByText('Try it out'));

      expect(screen.queryByText('Request Body')).not.toBeInTheDocument();
    });

    it('should render Execute and Generate cURL buttons', () => {
      render(<TryItOut endpoint={mockEndpoint} />);

      fireEvent.click(screen.getByText('Try it out'));

      expect(screen.getByText('Execute')).toBeInTheDocument();
      expect(screen.getByText('Generate cURL')).toBeInTheDocument();
    });
  });

  describe('execute request', () => {
    it('should send request with correct URL and method', async () => {
      render(<TryItOut endpoint={mockEndpoint} />);

      fireEvent.click(screen.getByText('Try it out'));
      fireEvent.click(screen.getByText('Execute'));

      await waitFor(() => {
        expect(sendRequest).toHaveBeenCalledWith({
          url: 'https://api.example.com/v1/users',
          method: 'GET',
          headers: {},
          body: null,
        });
      });
    });

    it('should include path parameters in URL', async () => {
      const endpointWithPathParam: Endpoint = {
        ...mockEndpoint,
        path: '/users/{id}',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
      };

      render(<TryItOut endpoint={endpointWithPathParam} />);

      fireEvent.click(screen.getByText('Try it out'));

      const input = screen.getByPlaceholderText('id');
      fireEvent.change(input, { target: { value: '123' } });

      fireEvent.click(screen.getByText('Execute'));

      await waitFor(() => {
        expect(sendRequest).toHaveBeenCalledWith({
          url: 'https://api.example.com/v1/users/123',
          method: 'GET',
          headers: {},
          body: null,
        });
      });
    });

    it('should include query parameters in URL', async () => {
      render(<TryItOut endpoint={mockEndpoint} />);

      fireEvent.click(screen.getByText('Try it out'));

      const inputs = screen.getAllByRole('textbox');

      fireEvent.change(inputs[1], { target: { value: '10' } });

      fireEvent.click(screen.getByText('Execute'));

      await waitFor(() => {
        expect(sendRequest).toHaveBeenCalledWith({
          url: 'https://api.example.com/v1/users?limit=10',
          method: 'GET',
          headers: {},
          body: null,
        });
      });
    });

    it('should display response after execution', async () => {
      render(<TryItOut endpoint={mockEndpoint} />);

      fireEvent.click(screen.getByText('Try it out'));
      fireEvent.click(screen.getByText('Execute'));

      await waitFor(() => {
        expect(screen.getByText('200 OK')).toBeInTheDocument();
      });
    });

    it('should show error message on request failure', async () => {
      const error = new Error('Network error');
      (sendRequest as ReturnType<typeof vi.fn>).mockRejectedValue(error);

      render(<TryItOut endpoint={mockEndpoint} />);

      fireEvent.click(screen.getByText('Try it out'));
      fireEvent.click(screen.getByText('Execute'));

      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeInTheDocument();
      });
    });

    it('should disable Execute button while executing', async () => {
      (sendRequest as ReturnType<typeof vi.fn>).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      render(<TryItOut endpoint={mockEndpoint} />);

      fireEvent.click(screen.getByText('Try it out'));
      fireEvent.click(screen.getByText('Execute'));

      expect(screen.getByText('Executing...')).toBeInTheDocument();
    });
  });

  describe('save history', () => {
    it('should not save history when user is not authenticated', async () => {
      (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({ user: null });

      render(<TryItOut endpoint={mockEndpoint} />);

      fireEvent.click(screen.getByText('Try it out'));
      fireEvent.click(screen.getByText('Execute'));

      await waitFor(() => {
        expect(saveRequestHistory).not.toHaveBeenCalled();
      });
    });

    it('should show toast error when history save fails', async () => {
      (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({ user: mockUser });
      (saveRequestHistory as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('DB error'));

      render(<TryItOut endpoint={mockEndpoint} />);

      fireEvent.click(screen.getByText('Try it out'));
      fireEvent.click(screen.getByText('Execute'));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to save request history');
      });
    });
  });

  describe('generate cURL', () => {
    it('should generate and copy cURL when button is clicked', async () => {
      render(<TryItOut endpoint={mockEndpoint} />);

      fireEvent.click(screen.getByText('Try it out'));
      fireEvent.click(screen.getByText('Generate cURL'));

      await waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalled();
      });
    });

    it('should show success message after copying', async () => {
      render(<TryItOut endpoint={mockEndpoint} />);

      fireEvent.click(screen.getByText('Try it out'));
      fireEvent.click(screen.getByText('Generate cURL'));

      await waitFor(() => {
        expect(screen.getByText('cURL command copied to clipboard!')).toBeInTheDocument();
      });
    });

    it('should include parameters in generated cURL', async () => {
      render(<TryItOut endpoint={mockEndpoint} />);

      fireEvent.click(screen.getByText('Try it out'));

      const inputs = screen.getAllByRole('textbox');
      fireEvent.change(inputs[0], { target: { value: '123' } });
      fireEvent.change(inputs[1], { target: { value: '10' } });

      fireEvent.click(screen.getByText('Generate cURL'));

      const { generateCurl } = await import('../../services/curlGenerator');
      await waitFor(() => {
        expect(generateCurl).toHaveBeenCalledWith({
          method: 'GET',
          url: 'https://api.example.com/v1/users?limit=10',
          headers: {},
          body: null,
        });
      });
    });
  });

  describe('headers input', () => {
    it('should ignore invalid header format', async () => {
      render(<TryItOut endpoint={mockEndpoint} />);

      fireEvent.click(screen.getByText('Try it out'));

      const headerInput = screen.getByPlaceholderText('Content-Type: application/json');
      fireEvent.change(headerInput, { target: { value: 'invalid header' } });

      fireEvent.click(screen.getByText('Execute'));

      await waitFor(() => {
        expect(sendRequest).toHaveBeenCalledWith({
          url: 'https://api.example.com/v1/users',
          method: 'GET',
          headers: {},
          body: null,
        });
      });
    });
  });

  describe('edge cases', () => {
    it('should handle servers with trailing slash', async () => {
      const endpointWithSlash: Endpoint = {
        ...mockEndpoint,
        servers: [{ url: 'https://api.example.com/v1/' }],
      };

      render(<TryItOut endpoint={endpointWithSlash} />);

      fireEvent.click(screen.getByText('Try it out'));
      fireEvent.click(screen.getByText('Execute'));

      await waitFor(() => {
        expect(sendRequest).toHaveBeenCalledWith({
          url: 'https://api.example.com/v1/users',
          method: 'GET',
          headers: {},
          body: null,
        });
      });
    });

    it('should handle endpoint without servers', async () => {
      const endpointWithoutServers: Endpoint = {
        ...mockEndpoint,
        servers: undefined,
      };

      render(<TryItOut endpoint={endpointWithoutServers} />);

      fireEvent.click(screen.getByText('Try it out'));
      fireEvent.click(screen.getByText('Execute'));

      await waitFor(() => {
        expect(sendRequest).toHaveBeenCalledWith({
          url: '/users',
          method: 'GET',
          headers: {},
          body: null,
        });
      });
    });

    it('should handle null body gracefully', async () => {
      const endpointWithBody: Endpoint = {
        ...mockEndpoint,
        method: 'POST',
      };

      render(<TryItOut endpoint={endpointWithBody} />);

      fireEvent.click(screen.getByText('Try it out'));
      fireEvent.click(screen.getByText('Execute'));

      await waitFor(() => {
        expect(sendRequest).toHaveBeenCalledWith({
          url: 'https://api.example.com/v1/users',
          method: 'POST',
          headers: {},
          body: null,
        });
      });
    });
  });
});
