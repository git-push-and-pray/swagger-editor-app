import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ParameterObject } from '@/types/openapi';

import ParameterInputs from '../TryItOut/ParameterInputs';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'parameterInputs.title': 'Parameters',
    };
    return translations[key] || key;
  },
}));

describe('ParameterInputs', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render nothing when parameters array is empty', () => {
      const { container } = render(
        <ParameterInputs parameters={[]} values={{}} onChange={mockOnChange} />
      );

      expect(container.firstChild).toBeNull();
    });

    it('should render nothing when all parameters are cookie type', () => {
      const cookieParams: ParameterObject[] = [
        { name: 'sessionId', in: 'cookie', required: true },
        { name: 'userId', in: 'cookie' },
      ];

      const { container } = render(
        <ParameterInputs parameters={cookieParams} values={{}} onChange={mockOnChange} />
      );

      expect(container.firstChild).toBeNull();
    });

    it('should render title "Parameters" when there are visible parameters', () => {
      const params: ParameterObject[] = [
        { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
      ];

      render(<ParameterInputs parameters={params} values={{}} onChange={mockOnChange} />);

      expect(screen.getByText('Parameters')).toBeInTheDocument();
    });

    it('should display parameter name and location badge', () => {
      const params: ParameterObject[] = [{ name: 'userId', in: 'path', required: true }];

      render(<ParameterInputs parameters={params} values={{}} onChange={mockOnChange} />);

      expect(screen.getByText('userId')).toBeInTheDocument();
      expect(screen.getByText('path')).toBeInTheDocument();
    });

    it('should display required indicator (*) for required parameters', () => {
      const params: ParameterObject[] = [
        { name: 'id', in: 'path', required: true },
        { name: 'limit', in: 'query', required: false },
        { name: 'apiKey', in: 'header', required: true },
      ];

      render(<ParameterInputs parameters={params} values={{}} onChange={mockOnChange} />);

      const asterisks = screen.getAllByText('*');
      expect(asterisks).toHaveLength(2);
    });

    it('should treat path parameters as always required even if not specified', () => {
      const params: ParameterObject[] = [
        { name: 'id', in: 'path' },
        { name: 'limit', in: 'query' },
      ];

      render(<ParameterInputs parameters={params} values={{}} onChange={mockOnChange} />);

      const asterisks = screen.getAllByText('*');

      expect(asterisks).toHaveLength(1);
      expect(screen.getByText('id')).toBeInTheDocument();
    });
  });

  describe('input interaction', () => {
    it('should call onChange with updated value when user types', () => {
      const params: ParameterObject[] = [
        { name: 'id', in: 'path', required: true },
        { name: 'name', in: 'query' },
      ];
      const initialValues = { id: '123' };

      render(
        <ParameterInputs parameters={params} values={initialValues} onChange={mockOnChange} />
      );

      const inputs = screen.getAllByRole('textbox');

      fireEvent.change(inputs[1], { target: { value: 'test-user' } });

      expect(mockOnChange).toHaveBeenCalledWith({
        id: '123',
        name: 'test-user',
      });
    });

    it('should display current values from values prop', () => {
      const params: ParameterObject[] = [
        { name: 'id', in: 'path', required: true },
        { name: 'limit', in: 'query' },
        { name: 'apiKey', in: 'header' },
      ];
      const values = {
        id: '456',
        limit: '10',
        apiKey: 'secret-key',
      };

      render(<ParameterInputs parameters={params} values={values} onChange={mockOnChange} />);

      const inputs = screen.getAllByRole('textbox');

      expect(inputs[0]).toHaveValue('456');
      expect(inputs[1]).toHaveValue('10');
      expect(inputs[2]).toHaveValue('secret-key');
    });

    it('should use description as placeholder when available', () => {
      const params: ParameterObject[] = [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'User ID (integer)',
        },
        {
          name: 'name',
          in: 'query',
          description: 'Filter by name',
        },
      ];

      render(<ParameterInputs parameters={params} values={{}} onChange={mockOnChange} />);

      const inputs = screen.getAllByRole('textbox');

      expect(inputs[0]).toHaveAttribute('placeholder', 'User ID (integer)');
      expect(inputs[1]).toHaveAttribute('placeholder', 'Filter by name');
    });

    it('should use parameter name as placeholder when description is not available', () => {
      const params: ParameterObject[] = [
        { name: 'id', in: 'path', required: true },
        { name: 'limit', in: 'query' },
      ];

      render(<ParameterInputs parameters={params} values={{}} onChange={mockOnChange} />);

      const inputs = screen.getAllByRole('textbox');

      expect(inputs[0]).toHaveAttribute('placeholder', 'id');
      expect(inputs[1]).toHaveAttribute('placeholder', 'limit');
    });

    it('should filter out cookie parameters', () => {
      const params: ParameterObject[] = [
        { name: 'id', in: 'path', required: true },
        { name: 'sessionId', in: 'cookie' },
        { name: 'limit', in: 'query' },
        { name: 'authToken', in: 'cookie' },
        { name: 'apiKey', in: 'header' },
      ];

      render(<ParameterInputs parameters={params} values={{}} onChange={mockOnChange} />);

      const inputs = screen.getAllByRole('textbox');

      expect(inputs).toHaveLength(3);

      expect(screen.queryByText('sessionId')).not.toBeInTheDocument();
      expect(screen.queryByText('authToken')).not.toBeInTheDocument();
    });

    it('should preserve other values when updating one parameter', () => {
      const params: ParameterObject[] = [
        { name: 'id', in: 'path', required: true },
        { name: 'limit', in: 'query' },
        { name: 'sort', in: 'query' },
      ];
      const initialValues = {
        id: '1',
        limit: '10',
        sort: 'asc',
      };

      render(
        <ParameterInputs parameters={params} values={initialValues} onChange={mockOnChange} />
      );

      const inputs = screen.getAllByRole('textbox');

      fireEvent.change(inputs[1], { target: { value: '20' } });

      expect(mockOnChange).toHaveBeenCalledWith({
        id: '1',
        limit: '20',
        sort: 'asc',
      });
    });
  });

  describe('edge cases', () => {
    it('should handle complex parameter schema without crashing', () => {
      const params: ParameterObject[] = [
        {
          name: 'filter',
          in: 'query',
          schema: {
            type: 'object',
            properties: {
              field: { type: 'string' },
              value: { type: 'string' },
            },
          },
        },
      ];

      render(<ParameterInputs parameters={params} values={{}} onChange={mockOnChange} />);

      expect(screen.getByText('filter')).toBeInTheDocument();
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    it('should convert values to string for input display', () => {
      const params: ParameterObject[] = [
        { name: 'count', in: 'query' },
        { name: 'flag', in: 'query' },
      ];
      const values = {
        count: 42,
        flag: true,
      };

      render(<ParameterInputs parameters={params} values={values} onChange={mockOnChange} />);

      const inputs = screen.getAllByRole('textbox');

      expect(inputs[0]).toHaveValue('42');
      expect(inputs[1]).toHaveValue('true');
    });
  });
});
