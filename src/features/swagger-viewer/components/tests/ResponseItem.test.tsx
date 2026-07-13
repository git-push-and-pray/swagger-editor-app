import { render, screen } from '@testing-library/react';
import type { ResponseObject } from 'openapi-types-v3.1.0';
import { describe, expect, it, vi } from 'vitest';

import ResponseItem from '../ResponseItem';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'responses.schema': 'Schema',
      'responses.example': 'Example',
      'responses.examples': 'Examples',
    };
    return translations[key] || key;
  },
}));

vi.mock('../shared/utils/generateExample', () => ({
  generateExample: vi.fn((schema) => {
    if (schema.type === 'object') {
      return { id: 1, name: 'generated' };
    }
    if (schema.type === 'array') {
      return [{ id: 1 }];
    }
    if (schema.type === 'string') {
      return 'generated-string';
    }
    return null;
  }),
}));

vi.mock('../shared/utils/typeQuards', () => ({
  isValidMediaObject: vi.fn((obj) => obj && typeof obj === 'object'),
}));

describe('ResponseItem', () => {
  describe('rendering status code', () => {
    it('should render status code and description', () => {
      const response: ResponseObject = {
        description: 'OK',
      };

      render(<ResponseItem statusCode="200" response={response} />);

      expect(screen.getByText('200')).toBeInTheDocument();
      expect(screen.getByText('OK')).toBeInTheDocument();
    });

    it('should render success status code in green (2xx)', () => {
      const response: ResponseObject = {
        description: 'OK',
      };

      const { container } = render(<ResponseItem statusCode="200" response={response} />);

      const statusElement = container.querySelector('.text-accentdark');
      expect(statusElement).toBeInTheDocument();
    });

    it('should render error status code in red (4xx)', () => {
      const response: ResponseObject = {
        description: 'Not Found',
      };

      const { container } = render(<ResponseItem statusCode="404" response={response} />);

      const statusElement = container.querySelector('.text-errordark');
      expect(statusElement).toBeInTheDocument();
    });

    it('should render error status code in red (5xx)', () => {
      const response: ResponseObject = {
        description: 'Internal Server Error',
      };

      const { container } = render(<ResponseItem statusCode="500" response={response} />);

      const statusElement = container.querySelector('.text-errordark');
      expect(statusElement).toBeInTheDocument();
    });

    it('should render other status codes in secondary color', () => {
      const response: ResponseObject = {
        description: 'Processing',
      };

      const { container } = render(<ResponseItem statusCode="102" response={response} />);

      const statusElement = container.querySelector('.text-text-secondary');
      expect(statusElement).toBeInTheDocument();
    });
  });

  describe('rendering content', () => {
    it('should render content when response has content', () => {
      const response: ResponseObject = {
        description: 'OK',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                id: { type: 'integer' },
                name: { type: 'string' },
              },
            },
          },
        },
      };

      render(<ResponseItem statusCode="200" response={response} />);

      expect(screen.getByText('application/json')).toBeInTheDocument();
    });

    it('should not render content section when response has no content', () => {
      const response: ResponseObject = {
        description: 'No Content',
      };

      render(<ResponseItem statusCode="204" response={response} />);

      expect(screen.queryByText('Schema')).not.toBeInTheDocument();
    });
  });

  describe('multiple media types', () => {
    it('should render multiple media types', () => {
      const response: ResponseObject = {
        description: 'OK',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: { id: { type: 'integer' } },
            },
          },
          'application/xml': {
            schema: {
              type: 'object',
              properties: { id: { type: 'integer' } },
            },
          },
        },
      };

      render(<ResponseItem statusCode="200" response={response} />);

      expect(screen.getByText('application/json')).toBeInTheDocument();
      expect(screen.getByText('application/xml')).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('should handle empty content gracefully', () => {
      const response: ResponseObject = {
        description: 'OK',
        content: {},
      };

      render(<ResponseItem statusCode="200" response={response} />);

      expect(screen.getByText('200')).toBeInTheDocument();
      expect(screen.getByText('OK')).toBeInTheDocument();

      expect(screen.queryByText('Schema')).not.toBeInTheDocument();
    });

    it('should handle mediaObject without schema or examples', () => {
      const response: ResponseObject = {
        description: 'OK',
        content: {
          'application/json': {},
        },
      };

      render(<ResponseItem statusCode="200" response={response} />);

      expect(screen.getByText('application/json')).toBeInTheDocument();
      expect(screen.queryByText('Schema')).not.toBeInTheDocument();
      expect(screen.queryByText('Example')).not.toBeInTheDocument();
    });

    it('should handle invalid mediaObject by skipping it', () => {
      const response: ResponseObject = {
        description: 'OK',
        content: {
          'application/json': null as unknown as Record<string, unknown>,
          'application/xml': {
            schema: {
              type: 'object',
              properties: { id: { type: 'integer' } },
            },
          },
        },
      };

      render(<ResponseItem statusCode="200" response={response} />);

      expect(screen.getByText('application/xml')).toBeInTheDocument();

      expect(screen.queryByText('application/json')).not.toBeInTheDocument();
    });
  });
});
