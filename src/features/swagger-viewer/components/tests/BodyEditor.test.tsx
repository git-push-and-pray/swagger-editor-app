import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { RequestBodyObject } from '@/types/openapi';

import BodyEditor from '../TryItOut/BodyEditor';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'bodyEditor.title': 'Request Body',
      'bodyEditor.fillExample': 'Fill with example',
      'bodyEditor.placeholder': 'Enter JSON request body',
      'bodyEditor.invalidJson': 'Invalid JSON',
    };
    return translations[key] || key;
  },
}));

describe('BodyEditor', () => {
  const mockRequestBody: RequestBodyObject = {
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            age: { type: 'integer' },
          },
        },
        example: {
          name: 'John Doe',
          age: 30,
        },
      },
    },
  };

  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render title with media type', () => {
      render(<BodyEditor requestBody={mockRequestBody} value={null} onChange={mockOnChange} />);

      expect(screen.getByText('Request Body')).toBeInTheDocument();
      expect(screen.getByText('application/json')).toBeInTheDocument();
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('should render "Fill with example" button when value is empty', () => {
      render(<BodyEditor requestBody={mockRequestBody} value={null} onChange={mockOnChange} />);

      expect(screen.getByText('Fill with example')).toBeInTheDocument();
    });

    it('should not render "Fill with example" button when value is not empty', () => {
      const mockValue = { name: 'Jane' };

      render(
        <BodyEditor requestBody={mockRequestBody} value={mockValue} onChange={mockOnChange} />
      );

      expect(screen.queryByText('Fill with example')).not.toBeInTheDocument();
    });

    it('should render textarea with placeholder', () => {
      render(<BodyEditor requestBody={mockRequestBody} value={null} onChange={mockOnChange} />);

      const textarea = screen.getByPlaceholderText('Enter JSON request body');
      expect(textarea).toBeInTheDocument();
      expect(textarea).toHaveAttribute('spellCheck', 'false');
    });

    it('should render * only when requestBody.required === true', () => {
      const notRequiredBody: RequestBodyObject = {
        ...mockRequestBody,
        required: false,
      };

      render(<BodyEditor requestBody={notRequiredBody} value={null} onChange={mockOnChange} />);

      expect(screen.queryByText('*')).not.toBeInTheDocument();
    });
  });

  describe('Text display', () => {
    it('should display current value in textarea', () => {
      const mockValue = { name: 'Test', age: 25 };

      render(
        <BodyEditor requestBody={mockRequestBody} value={mockValue} onChange={mockOnChange} />
      );

      const textarea = screen.getByPlaceholderText('Enter JSON request body');
      const expected = JSON.stringify(mockValue, null, 2);
      expect(textarea).toHaveValue(expected);
    });

    it('should display string value in textarea', () => {
      const mockValue = 'test string';

      render(
        <BodyEditor requestBody={mockRequestBody} value={mockValue} onChange={mockOnChange} />
      );

      const textarea = screen.getByPlaceholderText('Enter JSON request body');
      expect(textarea).toHaveValue('test string');
    });
  });

  describe('Text change handling', () => {
    it('should call onChange with parsed object for valid JSON', () => {
      render(<BodyEditor requestBody={mockRequestBody} value={null} onChange={mockOnChange} />);

      const textarea = screen.getByPlaceholderText('Enter JSON request body');
      const validJson = '{"name":"Alice","age":25}';

      fireEvent.change(textarea, { target: { value: validJson } });

      expect(mockOnChange).toHaveBeenCalledWith({ name: 'Alice', age: 25 });
      expect(screen.queryByText('Invalid JSON')).not.toBeInTheDocument();
    });

    it('should show error for invalid JSON', () => {
      render(<BodyEditor requestBody={mockRequestBody} value={null} onChange={mockOnChange} />);

      const textarea = screen.getByPlaceholderText('Enter JSON request body');
      const invalidJson = '{"name": "Alice",}';

      fireEvent.change(textarea, { target: { value: invalidJson } });

      expect(screen.getByText('Invalid JSON')).toBeInTheDocument();
      expect(mockOnChange).toHaveBeenCalledWith(invalidJson);
    });

    it('should clear error when valid JSON is entered after error', () => {
      render(<BodyEditor requestBody={mockRequestBody} value={null} onChange={mockOnChange} />);

      const textarea = screen.getByPlaceholderText('Enter JSON request body');

      fireEvent.change(textarea, { target: { value: '{"name": "Alice",}' } });
      expect(screen.getByText('Invalid JSON')).toBeInTheDocument();

      fireEvent.change(textarea, { target: { value: '{"name":"Alice"}' } });
      expect(screen.queryByText('Invalid JSON')).not.toBeInTheDocument();
    });
  });

  describe('Fill with example', () => {
    it('should fill with example from requestBody.example on button click', () => {
      const requestBodyWithExample: RequestBodyObject = {
        required: false,
        content: {
          'application/json': {
            example: {
              name: 'John',
              age: 30,
              email: 'john@example.com',
            },
          },
        },
      };

      render(
        <BodyEditor requestBody={requestBodyWithExample} value={null} onChange={mockOnChange} />
      );

      const button = screen.getByText('Fill with example');
      fireEvent.click(button);

      const expected = JSON.stringify(
        { name: 'John', age: 30, email: 'john@example.com' },
        null,
        2
      );
      expect(mockOnChange).toHaveBeenCalledWith(JSON.parse(expected));
    });

    it('should generate example from schema when example is not provided', () => {
      const requestBodyWithSchema: RequestBodyObject = {
        required: false,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                id: { type: 'integer' },
                name: { type: 'string' },
                isActive: { type: 'boolean' },
              },
            },
          },
        },
      };

      render(
        <BodyEditor requestBody={requestBodyWithSchema} value={null} onChange={mockOnChange} />
      );

      const button = screen.getByText('Fill with example');
      fireEvent.click(button);

      const expected = { id: 0, name: 'string', isActive: true };
      expect(mockOnChange).toHaveBeenCalledWith(expected);
    });

    it('should generate example for array schema', () => {
      const requestBodyWithArray: RequestBodyObject = {
        required: false,
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'integer' },
                  name: { type: 'string' },
                },
              },
            },
          },
        },
      };

      render(
        <BodyEditor requestBody={requestBodyWithArray} value={null} onChange={mockOnChange} />
      );

      const button = screen.getByText('Fill with example');
      fireEvent.click(button);

      const expected = [{ id: 0, name: 'string' }];
      expect(mockOnChange).toHaveBeenCalledWith(expected);
    });

    it('should show fallback when neither schema nor example is provided', () => {
      const emptyBody: RequestBodyObject = {
        required: false,
        content: {
          'application/json': {},
        },
      };

      render(<BodyEditor requestBody={emptyBody} value={null} onChange={mockOnChange} />);

      const button = screen.getByText('Fill with example');
      fireEvent.click(button);

      expect(mockOnChange).toHaveBeenCalledWith(JSON.parse('{\n  \n}'));
    });
  });

  describe('defaultMediaType', () => {
    it('should use first media type from content', () => {
      const bodyWithMultipleTypes: RequestBodyObject = {
        required: false,
        content: {
          'application/json': {},
          'application/xml': {},
        },
      };

      render(
        <BodyEditor requestBody={bodyWithMultipleTypes} value={null} onChange={mockOnChange} />
      );

      expect(screen.getByText('application/json')).toBeInTheDocument();
    });

    it('should use "application/json" as fallback', () => {
      const bodyWithoutContent: RequestBodyObject = {
        required: false,
        content: {},
      };

      render(<BodyEditor requestBody={bodyWithoutContent} value={null} onChange={mockOnChange} />);

      expect(screen.getByText('application/json')).toBeInTheDocument();
    });
  });
});
